import json
import os
import sqlite3

from flask import Flask, jsonify, request, session


app = Flask(__name__)

# Flask uses this key to sign the teacher login session cookie.
app.secret_key = os.environ.get("STUDENTNET_SECRET_KEY", "change-this-dev-secret")

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATABASE_FILE = os.path.join(BASE_DIR, "studentnet.db")

# These are the frontend addresses that are allowed to talk to Flask.
ALLOWED_ORIGINS = {
    "http://localhost:5173",
    "http://127.0.0.1:5173",
}


def get_database_connection():
    # Open the SQLite database and return rows that behave like dictionaries.
    connection = sqlite3.connect(DATABASE_FILE)
    connection.row_factory = sqlite3.Row
    return connection


def setup_database():
    # Create the required database tables if they do not exist yet.
    with get_database_connection() as connection:
        connection.execute(
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

        teacher_exists = connection.execute(
            "SELECT id FROM teachers WHERE email = ?",
            ("teacher@osc.school.nz",),
        ).fetchone()

        if not teacher_exists:
            # Add one starter teacher account so the project works immediately.
            # Later you can replace this with real teacher accounts using manage_teachers.py.
            connection.execute(
                """
                INSERT INTO teachers (email, password, is_active)
                VALUES (?, ?, ?)
                """,
                ("teacher@osc.school.nz", "studentnet2026", 1),
            )


def find_teacher(email):
    # Find one teacher account by email.
    with get_database_connection() as connection:
        return connection.execute(
            """
            SELECT email, password, is_active
            FROM teachers
            WHERE email = ?
            """,
            (email.lower(),),
        ).fetchone()


def is_teacher_active(email):
    # Check that a teacher still has access before allowing admin actions.
    teacher = find_teacher(email)
    return bool(teacher and teacher["is_active"])


setup_database()


@app.after_request
def add_cors_headers(response):
    # Allow the React app to send requests and receive session cookies.
    origin = request.headers.get("Origin")

    if origin in ALLOWED_ORIGINS:
        response.headers["Access-Control-Allow-Origin"] = origin
        response.headers["Access-Control-Allow-Credentials"] = "true"
        response.headers["Access-Control-Allow-Headers"] = "Content-Type"
        response.headers["Access-Control-Allow-Methods"] = "GET,POST,PUT,OPTIONS"

    return response


@app.route("/api/login", methods=["POST", "OPTIONS"])
def login():
    # Check teacher details against the SQLite teachers table.
    if request.method == "OPTIONS":
        return "", 204

    # React sends JSON like {"email": "...", "password": "..."}.
    data = request.get_json(silent=True) or {}
    email = data.get("email", "").strip().lower()
    password = data.get("password", "")
    teacher = find_teacher(email)

    # This is simple for the assessment; a real school app would hash passwords.
    if not teacher or not teacher["is_active"] or teacher["password"] != password:
        return jsonify({"message": "Invalid email or password."}), 401

    session["teacher_email"] = teacher["email"]
    return jsonify({"teacher": {"email": teacher["email"]}})


@app.route("/api/logout", methods=["POST", "OPTIONS"])
def logout():
    # Clear the current teacher login session.
    if request.method == "OPTIONS":
        return "", 204

    session.clear()
    return jsonify({"message": "Logged out."})


@app.route("/api/me")
def current_user():
    # Let React check if a teacher is currently logged in.
    teacher_email = session.get("teacher_email")

    if not teacher_email or not is_teacher_active(teacher_email):
        session.clear()
        return jsonify({"teacher": None}), 401

    return jsonify({"teacher": {"email": teacher_email}})


@app.route("/api/content/<content_key>", methods=["GET", "PUT", "OPTIONS"])
def content(content_key):
    # Save or load editable website content from the SQLite content table.
    if request.method == "OPTIONS":
        return "", 204

    if request.method == "GET":
        # Students can read page content, but only logged-in teachers can update it.
        with get_database_connection() as connection:
            saved_content = connection.execute(
                "SELECT value FROM content WHERE key = ?",
                (content_key,),
            ).fetchone()

        if not saved_content:
            return jsonify({"value": None}), 404

        return jsonify({"value": json.loads(saved_content["value"])})

    teacher_email = session.get("teacher_email")

    if not teacher_email or not is_teacher_active(teacher_email):
        return jsonify({"message": "Teacher login required."}), 401

    data = request.get_json(silent=True) or {}

    with get_database_connection() as connection:
        connection.execute(
            """
            INSERT INTO content (key, value, updated_at)
            VALUES (?, ?, CURRENT_TIMESTAMP)
            ON CONFLICT(key) DO UPDATE SET
                value = excluded.value,
                updated_at = CURRENT_TIMESTAMP
            """,
            (content_key, json.dumps(data.get("value"))),
        )

    return jsonify({"message": "Saved."})


@app.route("/api/health")
def health_check():
    # Simple endpoint used to confirm Flask is running.
    return jsonify({"status": "ok"})


if __name__ == "__main__":
    app.run(debug=True, port=5000)
