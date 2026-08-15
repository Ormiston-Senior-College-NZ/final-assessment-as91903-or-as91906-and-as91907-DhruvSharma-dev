"""Flask backend for StudentNET.

React sends requests to this file instead of opening the database itself. Flask
checks the request and teacher login before reading or changing any data. The
database stores teacher accounts, editable content, announcements, subjects and
a history of changes.

setup_database creates any missing tables when the server starts. It also moves
older saved data into the newer tables without copying it more than once.
"""

import json
import os
import sqlite3

from flask import Flask, jsonify, request, session
from werkzeug.security import check_password_hash, generate_password_hash


app = Flask(__name__)

# Flask uses this secret to protect login cookies from being changed by users.
# A different secret can be supplied through the environment when the site is hosted.
app.secret_key = os.environ.get("STUDENTNET_SECRET_KEY", "change-this-dev-secret")

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATABASE_FILE = os.path.join(BASE_DIR, "studentnet.db")

# React and Flask use different ports during development. This list only allows
# requests from the local React website.
ALLOWED_ORIGINS = {
    "http://localhost:5173",
    "http://127.0.0.1:5173",
}

ALLOWED_CONTENT_KEYS = {
    # These smaller sections are saved as JSON. Announcements and curriculum use
    # separate tables because their records need to be edited individually.
    "studentnet-whats-on-this-week": "list",
    "studentnet-quick-links": "list",
    "studentnet-student-info-links": "list",
    "studentnet-web-app-links": "list",
    "studentnet-careers-support": "careers",
    "studentnet-school-norms": "list",
}


# -----------------------------------------------------------------------------
# Validation and database connection helpers
# -----------------------------------------------------------------------------


def is_password_hash(value):
    # Werkzeug hashes contain a method name followed by a colon and parameters.
    return isinstance(value, str) and value.startswith(("scrypt:", "pbkdf2:"))


def validate_content_value(content_key, value):
    """Return an error message when editable content has an invalid shape."""
    expected_shape = ALLOWED_CONTENT_KEYS[content_key]

    if expected_shape == "list" and not isinstance(value, list):
        return "This content must be a list."

    required_list_fields = {
        "studentnet-whats-on-this-week": "title",
        "studentnet-quick-links": "label",
        "studentnet-student-info-links": "label",
        "studentnet-web-app-links": "label",
        "studentnet-school-norms": "title",
    }
    required_field = required_list_fields.get(content_key)
    if required_field and any(
        not isinstance(item, dict)
        or not isinstance(item.get(required_field), str)
        or not item[required_field].strip()
        for item in value
    ):
        return f"Every item requires a {required_field}."

    if expected_shape == "careers":
        if not isinstance(value, dict):
            return "Careers content must contain a title and message."
        if not isinstance(value.get("title"), str) or not value["title"].strip():
            return "Careers content requires a title."
        if not isinstance(value.get("message"), str):
            return "Careers content requires a message."

    return None


def get_database_connection():
    # sqlite3.Row allows code to use row["email"] instead of a numbered position,
    # making database results easier to understand and less likely to be mixed up.
    connection = sqlite3.connect(DATABASE_FILE)
    connection.row_factory = sqlite3.Row
    # SQLite requires foreign-key enforcement to be enabled per connection.
    connection.execute("PRAGMA foreign_keys = ON")
    return connection


def setup_database():
    # IF NOT EXISTS makes setup safe to run every time Flask starts. Existing
    # tables and saved website content are left unchanged.
    with get_database_connection() as connection:
        # Teacher accounts and editable website content are kept in separate tables.
        connection.execute(
            # The generic content table remains appropriate for small sections
            # that are always loaded and saved as one independent collection.
            """
            CREATE TABLE IF NOT EXISTS teachers (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                email TEXT NOT NULL UNIQUE,
                password TEXT NOT NULL,
                is_active INTEGER NOT NULL DEFAULT 1
            )
            """
        )

        connection.execute(
            """
            CREATE TABLE IF NOT EXISTS content (
                key TEXT PRIMARY KEY,
                value TEXT NOT NULL,
                updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
            )
            """
        )

        # Add editor tracking to databases created before this relationship was
        # introduced. SQLite keeps every existing content row during the change.
        content_columns = {
            column["name"]
            for column in connection.execute("PRAGMA table_info(content)").fetchall()
        }
        if "updated_by" not in content_columns:
            connection.execute(
                "ALTER TABLE content ADD COLUMN updated_by INTEGER "
                "REFERENCES teachers(id)"
            )

        connection.execute(
            """
            CREATE TABLE IF NOT EXISTS content_history (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                content_key TEXT NOT NULL,
                previous_value TEXT,
                new_value TEXT NOT NULL,
                changed_by INTEGER NOT NULL,
                changed_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (content_key) REFERENCES content(key),
                FOREIGN KEY (changed_by) REFERENCES teachers(id)
            )
            """
        )

        # Announcements use individual rows so Flask can create, update and
        # delete one notice without replacing an entire JSON collection.
        connection.execute(
            """
            CREATE TABLE IF NOT EXISTS announcements (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL CHECK (length(trim(title)) > 0),
                message TEXT NOT NULL DEFAULT '',
                display_date TEXT NOT NULL DEFAULT '',
                updated_by INTEGER,
                updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (updated_by) REFERENCES teachers(id)
            )
            """
        )

        # sort_order controls the order of the curriculum levels on the website.
        connection.execute(
            """
            CREATE TABLE IF NOT EXISTS curriculum_levels (
                id TEXT PRIMARY KEY,
                label TEXT NOT NULL UNIQUE,
                sort_order INTEGER NOT NULL UNIQUE
            )
            """
        )
        connection.executemany(
            """
            INSERT INTO curriculum_levels (id, label, sort_order)
            VALUES (?, ?, ?)
            ON CONFLICT(id) DO UPDATE SET
                label = excluded.label,
                sort_order = excluded.sort_order
            """,
            [
                ("level1", "LEVEL 1", 1),
                ("level2", "LEVEL 2", 2),
                ("level3", "LEVEL 3", 3),
                ("scholarships", "Scholarships", 4),
            ],
        )

        # A subject name is stored once even when that subject appears at several
        # curriculum levels. COLLATE NOCASE prevents case-only duplicates.
        connection.execute(
            """
            CREATE TABLE IF NOT EXISTS subjects (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL COLLATE NOCASE UNIQUE
                    CHECK (length(trim(name)) > 0),
                updated_by INTEGER,
                updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (updated_by) REFERENCES teachers(id)
            )
            """
        )

        # This table connects subjects to levels. A subject can be used at several
        # levels, with a different description and pathway for each one.
        connection.execute(
            """
            CREATE TABLE IF NOT EXISTS subject_levels (
                subject_id INTEGER NOT NULL,
                level_id TEXT NOT NULL,
                description TEXT NOT NULL DEFAULT '',
                pathway TEXT NOT NULL DEFAULT '',
                updated_by INTEGER,
                updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (subject_id, level_id),
                FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE,
                FOREIGN KEY (level_id) REFERENCES curriculum_levels(id)
                    ON DELETE RESTRICT,
                FOREIGN KEY (updated_by) REFERENCES teachers(id)
            )
            """
        )

        # This table records whether older saved data has already been moved, so
        # starting Flask again does not create duplicate records.
        connection.execute(
            """
            CREATE TABLE IF NOT EXISTS schema_migrations (
                name TEXT PRIMARY KEY,
                applied_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
            )
            """
        )

        teacher_exists = connection.execute(
            "SELECT id FROM teachers WHERE email = ?",
            ("teacher@osc.school.nz",),
        ).fetchone()

        if not teacher_exists:
            # Create one starter login only when it is missing. Real accounts can
            # then be managed separately using the manage_teachers.py script.
            connection.execute(
                """
                INSERT INTO teachers (email, password, is_active)
                VALUES (?, ?, ?)
                """,
                (
                    "teacher@osc.school.nz",
                    generate_password_hash("studentnet2026"),
                    1,
                ),
            )

        # Change any older plain-text passwords into secure password hashes.
        teachers = connection.execute(
            "SELECT id, password FROM teachers"
        ).fetchall()
        for teacher in teachers:
            if not is_password_hash(teacher["password"]):
                connection.execute(
                    "UPDATE teachers SET password = ? WHERE id = ?",
                    (generate_password_hash(teacher["password"]), teacher["id"]),
                )

        # Copy older JSON data into the new tables. The old copy is kept in case
        # anything needs to be checked afterwards.
        migration_name = "normalise_announcements_and_curriculum_v1"
        migration_applied = connection.execute(
            "SELECT name FROM schema_migrations WHERE name = ?",
            (migration_name,),
        ).fetchone()
        if not migration_applied:
            announcement_content = connection.execute(
                "SELECT value FROM content WHERE key = ?",
                ("studentnet-announcements",),
            ).fetchone()
            if announcement_content:
                # Ignore damaged blank records rather than breaking app startup.
                for announcement in json.loads(announcement_content["value"]):
                    title = str(announcement.get("title", "")).strip()
                    if title:
                        connection.execute(
                            """
                            INSERT INTO announcements (title, message, display_date)
                            VALUES (?, ?, ?)
                            """,
                            (
                                title,
                                str(announcement.get("message", "")).strip(),
                                str(announcement.get("date", "")).strip(),
                            ),
                        )

            curriculum_content = connection.execute(
                "SELECT value FROM content WHERE key = ?",
                ("studentnet-curriculum-subjects",),
            ).fetchone()
            if curriculum_content:
                curriculum = json.loads(curriculum_content["value"])
                for level_id, level_subjects in curriculum.items():
                    if level_id not in {"level1", "level2", "level3", "scholarships"}:
                        continue
                    for subject in level_subjects:
                        name = str(subject.get("name", "")).strip()
                        if not name:
                            continue
                        connection.execute(
                            # Reuse the same subject when it appears at more than
                            # one curriculum level.
                            "INSERT INTO subjects (name) VALUES (?) "
                            "ON CONFLICT(name) DO NOTHING",
                            (name,),
                        )
                        subject_row = connection.execute(
                            "SELECT id FROM subjects WHERE name = ? COLLATE NOCASE",
                            (name,),
                        ).fetchone()
                        connection.execute(
                            """
                            INSERT INTO subject_levels (
                                subject_id, level_id, description, pathway
                            )
                            VALUES (?, ?, ?, ?)
                            ON CONFLICT(subject_id, level_id) DO UPDATE SET
                                description = excluded.description,
                                pathway = excluded.pathway
                            """,
                            (
                                subject_row["id"],
                                level_id,
                                str(subject.get("description", "")).strip(),
                                str(subject.get("pathway", "")).strip(),
                            ),
                        )

            connection.execute(
                # Record this only after all the old data has been copied.
                "INSERT INTO schema_migrations (name) VALUES (?)",
                (migration_name,),
            )


def find_teacher(email):
    # The placeholder (?) keeps the email separate from the SQL command, which
    # prevents user input from being treated as SQL code.
    with get_database_connection() as connection:
        return connection.execute(
            """
            SELECT id, email, password, is_active
            FROM teachers
            WHERE email = ?
            """,
            (email.lower(),),
        ).fetchone()


def is_teacher_active(email):
    # Sessions can stay in a browser after access is removed. Checking is_active
    # on protected requests makes sure a disabled account cannot keep editing.
    teacher = find_teacher(email)
    return bool(teacher and teacher["is_active"])


# Make sure the required tables exist before Flask accepts requests.
setup_database()


# -----------------------------------------------------------------------------
# Session authentication and generic editable content
# -----------------------------------------------------------------------------

@app.after_request
def add_cors_headers(response):
    # Add CORS headers only for an approved React origin. Credentials must be
    # allowed because teacher authentication is stored in a Flask session cookie.
    origin = request.headers.get("Origin")

    if origin in ALLOWED_ORIGINS:
        response.headers["Access-Control-Allow-Origin"] = origin
        response.headers["Access-Control-Allow-Credentials"] = "true"
        response.headers["Access-Control-Allow-Headers"] = "Content-Type"
        response.headers["Access-Control-Allow-Methods"] = "GET,POST,PUT,DELETE,OPTIONS"

    return response


@app.route("/api/login", methods=["POST", "OPTIONS"])
def login():
    # Browsers send an OPTIONS preflight before some cross-origin POST requests.
    # Returning early confirms that the real login request is allowed.
    if request.method == "OPTIONS":
        return "", 204

    # silent=True avoids a Flask error if the body is missing or is not valid JSON.
    # Email is normalised so capital letters and spaces do not cause login failure.
    data = request.get_json(silent=True)
    if not isinstance(data, dict):
        return jsonify({"message": "Email and password are required."}), 400

    email = data.get("email", "").strip().lower()
    password = data.get("password", "")
    if not email or not isinstance(password, str) or not password:
        return jsonify({"message": "Email and password are required."}), 400

    teacher = find_teacher(email)

    if (
        not teacher
        or not teacher["is_active"]
        or not check_password_hash(teacher["password"], password)
    ):
        return jsonify({"message": "Invalid email or password."}), 401

    # Only the teacher's email is stored in the signed session cookie.
    session["teacher_email"] = teacher["email"]
    return jsonify({"teacher": {"email": teacher["email"]}})


@app.route("/api/logout", methods=["POST", "OPTIONS"])
def logout():
    # Clearing the whole session removes all stored login information.
    if request.method == "OPTIONS":
        return "", 204

    session.clear()
    return jsonify({"message": "Logged out."})


@app.route("/api/me")
def current_user():
    # React calls this before showing the Teacher Panel. The database check also
    # catches accounts that were disabled after their session was created.
    teacher_email = session.get("teacher_email")

    if not teacher_email or not is_teacher_active(teacher_email):
        session.clear()
        return jsonify({"teacher": None}), 401

    return jsonify({"teacher": {"email": teacher_email}})


@app.route("/api/content/<content_key>", methods=["GET", "PUT", "OPTIONS"])
def content(content_key):
    # One route handles every editable section by using content_key as the row key.
    # GET is public for student pages, while PUT is protected for teacher edits.
    if request.method == "OPTIONS":
        return "", 204

    if content_key not in ALLOWED_CONTENT_KEYS:
        return jsonify({"message": "Unknown content section."}), 404

    if request.method == "GET":
        # A missing row returns 404 so React knows to use its default/local copy.
        with get_database_connection() as connection:
            saved_content = connection.execute(
                """
                SELECT content.value, content.updated_at, teachers.email AS updated_by
                FROM content
                LEFT JOIN teachers ON content.updated_by = teachers.id
                WHERE content.key = ?
                """,
                (content_key,),
            ).fetchone()

        if not saved_content:
            return jsonify({"value": None}), 404

        # Values are stored as JSON text because each section has a different shape.
        return jsonify(
            {
                "value": json.loads(saved_content["value"]),
                "updated_at": saved_content["updated_at"],
                "updated_by": saved_content["updated_by"],
            }
        )

    # All code below this point belongs to PUT, so require an active teacher.
    teacher_email = session.get("teacher_email")
    teacher = find_teacher(teacher_email) if teacher_email else None

    if not teacher or not teacher["is_active"]:
        return jsonify({"message": "Teacher login required."}), 401

    data = request.get_json(silent=True)
    if not isinstance(data, dict) or "value" not in data:
        return jsonify({"message": "A JSON value is required."}), 400

    validation_error = validate_content_value(content_key, data["value"])
    if validation_error:
        return jsonify({"message": validation_error}), 400

    with get_database_connection() as connection:
        previous_content = connection.execute(
            "SELECT value FROM content WHERE key = ?",
            (content_key,),
        ).fetchone()
        new_value = json.dumps(data["value"])

        # UPSERT inserts new content or replaces the value if its key already exists.
        # This lets every editor use the same simple save endpoint.
        connection.execute(
            """
            INSERT INTO content (key, value, updated_at, updated_by)
            VALUES (?, ?, CURRENT_TIMESTAMP, ?)
            ON CONFLICT(key) DO UPDATE SET
                value = excluded.value,
                updated_at = CURRENT_TIMESTAMP,
                updated_by = excluded.updated_by
            """,
            (content_key, new_value, teacher["id"]),
        )
        connection.execute(
            """
            INSERT INTO content_history (
                content_key,
                previous_value,
                new_value,
                changed_by
            )
            VALUES (?, ?, ?, ?)
            """,
            (
                content_key,
                previous_content["value"] if previous_content else None,
                new_value,
                teacher["id"],
            ),
        )

    return jsonify({"message": "Saved."})


@app.route("/api/content/<content_key>/history", methods=["GET"])
def content_history(content_key):
    # Audit history contains teacher account information, so unlike public page
    # content it is available only to an active, logged-in teacher.
    if content_key not in ALLOWED_CONTENT_KEYS:
        return jsonify({"message": "Unknown content section."}), 404

    teacher_email = session.get("teacher_email")
    if not teacher_email or not is_teacher_active(teacher_email):
        return jsonify({"message": "Teacher login required."}), 401

    with get_database_connection() as connection:
        history = connection.execute(
            """
            SELECT
                content_history.id,
                content_history.content_key,
                content_history.previous_value,
                content_history.new_value,
                content_history.changed_at,
                teachers.email AS changed_by
            FROM content_history
            JOIN teachers ON content_history.changed_by = teachers.id
            WHERE content_history.content_key = ?
            ORDER BY content_history.id DESC
            """,
            (content_key,),
        ).fetchall()

    return jsonify(
        {
            "history": [
                {
                    "id": row["id"],
                    "content_key": row["content_key"],
                    "previous_value": (
                        json.loads(row["previous_value"])
                        if row["previous_value"] is not None
                        else None
                    ),
                    "new_value": json.loads(row["new_value"]),
                    "changed_at": row["changed_at"],
                    "changed_by": row["changed_by"],
                }
                for row in history
            ]
        }
    )


# -----------------------------------------------------------------------------
# Normalized announcement CRUD
# -----------------------------------------------------------------------------

def current_active_teacher():
    """Return the active teacher for a protected database operation."""
    teacher_email = session.get("teacher_email")
    teacher = find_teacher(teacher_email) if teacher_email else None
    return teacher if teacher and teacher["is_active"] else None


def announcement_to_dict(row):
    """Convert a joined SQLite row into the shape expected by React."""
    return {
        "id": row["id"],
        "title": row["title"],
        "message": row["message"],
        "date": row["display_date"],
        "updated_at": row["updated_at"],
        "updated_by": row["updated_by"],
    }


@app.route("/api/announcements", methods=["GET", "POST", "OPTIONS"])
def announcements():
    """Read all announcements publicly or create one for a logged-in teacher."""
    if request.method == "OPTIONS":
        return "", 204

    if request.method == "GET":
        with get_database_connection() as connection:
            # LEFT JOIN keeps announcements readable if an older migrated row
            # has no recorded editor, while still showing an email when present.
            rows = connection.execute(
                """
                SELECT
                    announcements.id,
                    announcements.title,
                    announcements.message,
                    announcements.display_date,
                    announcements.updated_at,
                    teachers.email AS updated_by
                FROM announcements
                LEFT JOIN teachers ON announcements.updated_by = teachers.id
                ORDER BY announcements.id DESC
                """
            ).fetchall()
        return jsonify({"announcements": [announcement_to_dict(row) for row in rows]})

    # POST changes shared data, so the remainder of this route is protected.
    teacher = current_active_teacher()
    if not teacher:
        return jsonify({"message": "Teacher login required."}), 401

    data = request.get_json(silent=True)
    if not isinstance(data, dict):
        return jsonify({"message": "Announcement data is required."}), 400
    title = str(data.get("title", "")).strip()
    if not title:
        return jsonify({"message": "Announcement title is required."}), 400

    with get_database_connection() as connection:
        cursor = connection.execute(
            """
            INSERT INTO announcements (
                title, message, display_date, updated_by
            )
            VALUES (?, ?, ?, ?)
            """,
            (
                title,
                str(data.get("message", "")).strip(),
                str(data.get("date", "")).strip(),
                teacher["id"],
            ),
        )
        announcement_id = cursor.lastrowid

    return jsonify({"id": announcement_id, "message": "Announcement created."}), 201


@app.route("/api/announcements/<int:announcement_id>", methods=["PUT", "DELETE", "OPTIONS"])
def announcement_detail(announcement_id):
    """Update or delete one announcement selected by its primary key."""
    if request.method == "OPTIONS":
        return "", 204

    teacher = current_active_teacher()
    if not teacher:
        return jsonify({"message": "Teacher login required."}), 401

    with get_database_connection() as connection:
        existing = connection.execute(
            "SELECT id FROM announcements WHERE id = ?",
            (announcement_id,),
        ).fetchone()
        if not existing:
            return jsonify({"message": "Announcement not found."}), 404

        if request.method == "DELETE":
            connection.execute(
                "DELETE FROM announcements WHERE id = ?",
                (announcement_id,),
            )
            return jsonify({"message": "Announcement deleted."})

        data = request.get_json(silent=True)
        if not isinstance(data, dict):
            return jsonify({"message": "Announcement data is required."}), 400
        title = str(data.get("title", "")).strip()
        if not title:
            return jsonify({"message": "Announcement title is required."}), 400

        connection.execute(
            """
            UPDATE announcements
            SET title = ?, message = ?, display_date = ?,
                updated_by = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
            """,
            (
                title,
                str(data.get("message", "")).strip(),
                str(data.get("date", "")).strip(),
                teacher["id"],
                announcement_id,
            ),
        )

    return jsonify({"message": "Announcement updated."})


# -----------------------------------------------------------------------------
# Normalized Curriculum CRUD and many-to-many subject assignments
# -----------------------------------------------------------------------------

def load_curriculum_from_database():
    """Run the multi-table JOIN and group flat SQL rows for the React pages."""
    curriculum = {level_id: [] for level_id in ("level1", "level2", "level3", "scholarships")}
    with get_database_connection() as connection:
        # all_levels is a second junction-table alias. GROUP_CONCAT uses it to
        # return every level assigned to a subject alongside the current level.
        rows = connection.execute(
            """
            SELECT
                subjects.id,
                subjects.name,
                subject_levels.level_id,
                subject_levels.description,
                subject_levels.pathway,
                subject_levels.updated_at,
                teachers.email AS updated_by,
                GROUP_CONCAT(all_levels.level_id) AS assigned_levels
            FROM subjects
            JOIN subject_levels ON subjects.id = subject_levels.subject_id
            JOIN curriculum_levels
                ON subject_levels.level_id = curriculum_levels.id
            LEFT JOIN subject_levels AS all_levels
                ON subjects.id = all_levels.subject_id
            LEFT JOIN teachers ON subject_levels.updated_by = teachers.id
            GROUP BY
                subjects.id,
                subject_levels.level_id,
                subject_levels.description,
                subject_levels.pathway,
                subject_levels.updated_at,
                teachers.email,
                curriculum_levels.sort_order
            ORDER BY curriculum_levels.sort_order, subjects.name
            """
        ).fetchall()

    for row in rows:
        # SQL returns one row per subject-level pairing; React uses an object
        # containing one array per level, so rebuild that presentation shape.
        curriculum[row["level_id"]].append(
            {
                "id": row["id"],
                "name": row["name"],
                "description": row["description"],
                "pathway": row["pathway"],
                "levels": row["assigned_levels"].split(","),
                "updated_at": row["updated_at"],
                "updated_by": row["updated_by"],
            }
        )
    return curriculum


@app.route("/api/curriculum", methods=["GET"])
def curriculum():
    """Provide the normalized curriculum to public student-facing pages."""
    subjects_by_level = load_curriculum_from_database()
    return jsonify({"subjects": subjects_by_level})


def validate_subject_request(data):
    """Normalize subject input and reject missing or unknown level IDs."""
    if not isinstance(data, dict):
        return None, "Subject data is required."
    name = str(data.get("name", "")).strip()
    if not name:
        return None, "Subject name is required."
    level_ids = data.get("levels")
    if not isinstance(level_ids, list) or not level_ids:
        return None, "Select at least one curriculum level."
    allowed_levels = {"level1", "level2", "level3", "scholarships"}
    # dict preserves checkbox order while removing duplicate level IDs.
    level_ids = list(dict.fromkeys(level_ids))
    if any(level_id not in allowed_levels for level_id in level_ids):
        return None, "An invalid curriculum level was supplied."
    editing_level = data.get("editing_level")
    if editing_level is not None and editing_level not in allowed_levels:
        return None, "An invalid editing level was supplied."
    return {
        "name": name,
        "description": str(data.get("description", "")).strip(),
        "pathway": str(data.get("pathway", "")).strip(),
        "levels": level_ids,
        "editing_level": editing_level,
    }, None


@app.route("/api/subjects", methods=["POST", "OPTIONS"])
def create_subject():
    """Create a subject and one junction row for every selected level."""
    if request.method == "OPTIONS":
        return "", 204
    teacher = current_active_teacher()
    if not teacher:
        return jsonify({"message": "Teacher login required."}), 401
    subject, error = validate_subject_request(request.get_json(silent=True))
    if error:
        return jsonify({"message": error}), 400

    with get_database_connection() as connection:
        connection.execute(
            # Reusing an existing name is intentional: it adds more level
            # relationships to one subject instead of duplicating that subject.
            """
            INSERT INTO subjects (name, updated_by)
            VALUES (?, ?)
            ON CONFLICT(name) DO UPDATE SET
                updated_by = excluded.updated_by,
                updated_at = CURRENT_TIMESTAMP
            """,
            (subject["name"], teacher["id"]),
        )
        subject_row = connection.execute(
            "SELECT id FROM subjects WHERE name = ? COLLATE NOCASE",
            (subject["name"],),
        ).fetchone()
        for level_id in subject["levels"]:
            # UPSERT makes repeated assignments safe and lets the same operation
            # update level-specific description and pathway information.
            connection.execute(
                """
                INSERT INTO subject_levels (
                    subject_id, level_id, description, pathway, updated_by
                )
                VALUES (?, ?, ?, ?, ?)
                ON CONFLICT(subject_id, level_id) DO UPDATE SET
                    description = excluded.description,
                    pathway = excluded.pathway,
                    updated_by = excluded.updated_by,
                    updated_at = CURRENT_TIMESTAMP
                """,
                (
                    subject_row["id"], level_id, subject["description"],
                    subject["pathway"], teacher["id"],
                ),
            )

    return jsonify({"id": subject_row["id"], "message": "Subject created."}), 201


@app.route("/api/subjects/<int:subject_id>", methods=["PUT", "DELETE", "OPTIONS"])
def subject_detail(subject_id):
    """Update subject relationships or delete one/all level assignments."""
    if request.method == "OPTIONS":
        return "", 204
    teacher = current_active_teacher()
    if not teacher:
        return jsonify({"message": "Teacher login required."}), 401

    with get_database_connection() as connection:
        existing = connection.execute(
            "SELECT id FROM subjects WHERE id = ?",
            (subject_id,),
        ).fetchone()
        if not existing:
            return jsonify({"message": "Subject not found."}), 404

        if request.method == "DELETE":
            level_id = request.args.get("level")
            if level_id:
                # The Teacher Panel deletes only the level currently being viewed.
                # Remove the subject as well if it no longer belongs to any level.
                result = connection.execute(
                    "DELETE FROM subject_levels WHERE subject_id = ? AND level_id = ?",
                    (subject_id, level_id),
                )
                if not result.rowcount:
                    return jsonify({"message": "Subject level assignment not found."}), 404
                remaining = connection.execute(
                    "SELECT 1 FROM subject_levels WHERE subject_id = ?",
                    (subject_id,),
                ).fetchone()
                if not remaining:
                    connection.execute("DELETE FROM subjects WHERE id = ?", (subject_id,))
            else:
                # Deleting the subject directly cascades through subject_levels.
                connection.execute("DELETE FROM subjects WHERE id = ?", (subject_id,))
            return jsonify({"message": "Subject deleted."})

        subject, error = validate_subject_request(request.get_json(silent=True))
        if error:
            return jsonify({"message": error}), 400
        try:
            connection.execute(
                """
                UPDATE subjects
                SET name = ?, updated_by = ?, updated_at = CURRENT_TIMESTAMP
                WHERE id = ?
                """,
                (subject["name"], teacher["id"], subject_id),
            )
        except sqlite3.IntegrityError:
            return jsonify({"message": "A subject with this name already exists."}), 409

        # A request from one sidebar editor changes only that level. API clients
        # without editing_level may still synchronize a complete level selection.
        if not subject["editing_level"]:
            placeholders = ",".join("?" for _ in subject["levels"])
            connection.execute(
                f"DELETE FROM subject_levels WHERE subject_id = ? "
                f"AND level_id NOT IN ({placeholders})",
                (subject_id, *subject["levels"]),
            )
        for level_id in subject["levels"]:
            existing_relationship = connection.execute(
                """
                SELECT 1 FROM subject_levels
                WHERE subject_id = ? AND level_id = ?
                """,
                (subject_id, level_id),
            ).fetchone()
            if (
                existing_relationship
                and subject["editing_level"]
                and level_id != subject["editing_level"]
            ):
                # Preserve different descriptions belonging to other levels when
                # a teacher edits the subject from one specific level screen.
                continue
            connection.execute(
                """
                INSERT INTO subject_levels (
                    subject_id, level_id, description, pathway, updated_by
                )
                VALUES (?, ?, ?, ?, ?)
                ON CONFLICT(subject_id, level_id) DO UPDATE SET
                    description = excluded.description,
                    pathway = excluded.pathway,
                    updated_by = excluded.updated_by,
                    updated_at = CURRENT_TIMESTAMP
                """,
                (
                    subject_id, level_id, subject["description"],
                    subject["pathway"], teacher["id"],
                ),
            )

    return jsonify({"message": "Subject updated."})


# -----------------------------------------------------------------------------
# Diagnostics and controlled error responses
# -----------------------------------------------------------------------------

@app.route("/api/health")
def health_check():
    # This route is a quick way to check Flask is running.
    return jsonify({"status": "ok"})


@app.errorhandler(sqlite3.Error)
def handle_database_error(error):
    # Return a controlled response instead of exposing database details to users.
    app.logger.error("Database error: %s", error)
    return jsonify({"message": "The database operation failed."}), 500


if __name__ == "__main__":
    # Debug mode is useful locally because Flask reloads when backend code changes.
    app.run(debug=True, port=5000)
