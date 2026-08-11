import json
import os
import sqlite3

from flask import Flask, jsonify, request, session


app = Flask(__name__)

# This key keeps the teacher login cookie secure.
app.secret_key = os.environ.get("STUDENTNET_SECRET_KEY", "change-this-dev-secret")

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATABASE_FILE = os.path.join(BASE_DIR, "studentnet.db")

# Only these local frontend addresses can use the backend.
ALLOWED_ORIGINS = {
    "http://localhost:5173",
    "http://127.0.0.1:5173",
}


def get_database_connection():
    # Open the database and make each row easy to read by column name.
    connection = sqlite3.connect(DATABASE_FILE)
    connection.row_factory = sqlite3.Row
    return connection


def setup_database():
    # Make the tables the first time the backend runs.
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
            # Add a starter login so the project can be tested straight away.
            # Real teacher accounts can be added with manage_teachers.py later.
            connection.execute(
                """
                INSERT INTO teachers (email, password, is_active)
                VALUES (?, ?, ?)
                """,
                ("teacher@osc.school.nz", "studentnet2026", 1),
            )


def find_teacher(email):
    # Look up a teacher using their email.
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
    # Check the teacher is still allowed into the panel.
    teacher = find_teacher(email)
    return bool(teacher and teacher["is_active"])


setup_database()


@app.after_request
def add_cors_headers(response):
    # Let React send requests and login cookies to Flask.
    origin = request.headers.get("Origin")

    if origin in ALLOWED_ORIGINS:
        response.headers["Access-Control-Allow-Origin"] = origin
        response.headers["Access-Control-Allow-Credentials"] = "true"
        response.headers["Access-Control-Allow-Headers"] = "Content-Type"
        response.headers["Access-Control-Allow-Methods"] = "GET,POST,PUT,OPTIONS"

    return response


@app.route("/api/login", methods=["POST", "OPTIONS"])
def login():
    # Check the login details against the teachers table.
    if request.method == "OPTIONS":
        return "", 204

    # Read the email and password sent by React.
    data = request.get_json(silent=True) or {}
    email = data.get("email", "").strip().lower()
    password = data.get("password", "")
    teacher = find_teacher(email)

    # This works for the assessment, but a real website should hash passwords.
    if not teacher or not teacher["is_active"] or teacher["password"] != password:
        return jsonify({"message": "Invalid email or password."}), 401

    session["teacher_email"] = teacher["email"]
    return jsonify({"teacher": {"email": teacher["email"]}})


@app.route("/api/logout", methods=["POST", "OPTIONS"])
def logout():
    # Remove the teacher's login session.
    if request.method == "OPTIONS":
        return "", 204

    session.clear()
    return jsonify({"message": "Logged out."})


@app.route("/api/me")
def current_user():
    # Tell React whether the teacher is logged in.
    teacher_email = session.get("teacher_email")

    if not teacher_email or not is_teacher_active(teacher_email):
        session.clear()
        return jsonify({"teacher": None}), 401

    return jsonify({"teacher": {"email": teacher_email}})


@app.route("/api/content/<content_key>", methods=["GET", "PUT", "OPTIONS"])
def content(content_key):
    # Load or save content teachers can edit.
    if request.method == "OPTIONS":
        return "", 204

    if request.method == "GET":
        # Anyone can read content, but only teachers can change it.
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
    # This route is a quick way to check Flask is running.
    return jsonify({"status": "ok"})


if __name__ == "__main__":
    app.run(debug=True, port=5000)
