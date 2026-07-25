import os
import sqlite3

from flask import Flask, jsonify, request, session


app = Flask(__name__)

app.secret_key = os.environ.get("STUDENTNET_SECRET_KEY", "change-this-dev-secret")

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATABASE_FILE = os.path.join(BASE_DIR, "studentnet.db")

ALLOWED_ORIGINS = {
    "http://localhost:5173",
    "http://127.0.0.1:5173",
}


def get_database_connection():
    connection = sqlite3.connect(DATABASE_FILE)
    connection.row_factory = sqlite3.Row
    return connection


def setup_database():
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

        teacher_exists = connection.execute(
            "SELECT id FROM teachers WHERE email = ?",
            ("teacher@osc.school.nz",),
        ).fetchone()

        if not teacher_exists:
            connection.execute(
                """
                INSERT INTO teachers (email, password, is_active)
                VALUES (?, ?, ?)
                """,
                ("teacher@osc.school.nz", "studentnet2026", 1),
            )


def find_teacher(email):
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
    teacher = find_teacher(email)
    return bool(teacher and teacher["is_active"])


setup_database()


@app.after_request
def add_cors_headers(response):
    origin = request.headers.get("Origin")

    if origin in ALLOWED_ORIGINS:
        response.headers["Access-Control-Allow-Origin"] = origin
        response.headers["Access-Control-Allow-Credentials"] = "true"
        response.headers["Access-Control-Allow-Headers"] = "Content-Type"
        response.headers["Access-Control-Allow-Methods"] = "GET,POST,OPTIONS"

    return response


@app.route("/api/login", methods=["POST", "OPTIONS"])
def login():
    if request.method == "OPTIONS":
        return "", 204

    data = request.get_json(silent=True) or {}
    email = data.get("email", "").strip().lower()
    password = data.get("password", "")
    teacher = find_teacher(email)

    if not teacher or not teacher["is_active"] or teacher["password"] != password:
        return jsonify({"message": "Invalid email or password."}), 401

    session["teacher_email"] = teacher["email"]
    return jsonify({"teacher": {"email": teacher["email"]}})


@app.route("/api/logout", methods=["POST", "OPTIONS"])
def logout():
    if request.method == "OPTIONS":
        return "", 204

    session.clear()
    return jsonify({"message": "Logged out."})


@app.route("/api/me")
def current_user():
    teacher_email = session.get("teacher_email")

    if not teacher_email or not is_teacher_active(teacher_email):
        session.clear()
        return jsonify({"teacher": None}), 401

    return jsonify({"teacher": {"email": teacher_email}})


@app.route("/api/health")
def health_check():
    return jsonify({"status": "ok"})


if __name__ == "__main__":
    app.run(debug=True, port=5000)
