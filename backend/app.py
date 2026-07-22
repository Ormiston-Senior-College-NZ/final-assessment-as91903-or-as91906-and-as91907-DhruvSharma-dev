import json
import os

from flask import Flask, jsonify, request, session

app = Flask(__name__)

app.secret_key = os.environ.get("STUDENTNET_SECRET_KEY", "change-this-dev-secret")

ALLOWED_ORIGINS = {
    "http://localhost:5173",
    "http://127.0.0.1:5173",
}

TEACHERS_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "teachers.json")


def get_teachers():
    with open(TEACHERS_FILE, "r", encoding="utf-8") as file:
        return json.load(file)


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

    for teacher in get_teachers():
        if teacher["email"].lower() == email and teacher["password"] == password and teacher.get("is_active", True):
            session["teacher_email"] = teacher["email"]
            return jsonify({"teacher": {"email": teacher["email"]}})

    return jsonify({"message": "Invalid email or password."}), 401


@app.route("/api/logout", methods=["POST", "OPTIONS"])
def logout():
    if request.method == "OPTIONS":
        return "", 204

    session.clear()
    return jsonify({"message": "Logged out."})


@app.route("/api/me")
def current_user():
    teacher_email = session.get("teacher_email")

    if not teacher_email:
        return jsonify({"teacher": None}), 401

    still_active = any(
        t["email"].lower() == teacher_email.lower() and t.get("is_active", True)
        for t in get_teachers()
    )

    if not still_active:
        session.clear()
        return jsonify({"teacher": None}), 401

    return jsonify({"teacher": {"email": teacher_email}})


@app.route("/api/health")
def health_check():
    return jsonify({"status": "ok"})


if __name__ == "__main__":
    app.run(debug=True, port=5000)
