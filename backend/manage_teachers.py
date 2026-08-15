"""Terminal-only teacher account administration for StudentNET.

Account management deliberately stays outside the Teacher Panel. Only an IT
administrator with access to the server terminal can add, reset, disable or inspect
accounts. The script shares the same SQLite file and password-hashing format as
app.py, so changes take effect the next time Flask validates a login or session.
"""

import argparse
import os
import sqlite3

from werkzeug.security import generate_password_hash


BASE_DIR = os.path.dirname(os.path.abspath(__file__))
# Build the path from this file so the script works from any terminal folder.
DATABASE_FILE = os.path.join(BASE_DIR, "studentnet.db")


def get_database_connection():
    # Open the same SQLite database used by the Flask app.
    connection = sqlite3.connect(DATABASE_FILE)
    connection.row_factory = sqlite3.Row
    connection.execute("PRAGMA foreign_keys = ON")
    return connection


def setup_database():
    # This script may be run before Flask, so it checks that the table exists first.
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


def add_teacher(email, password):
    # Add a new account. If the email already exists, update its password and
    # turn access back on instead of creating a duplicate teacher.
    setup_database()
    email = email.strip().lower()

    if "@" not in email or "." not in email.split("@", 1)[1]:
        raise ValueError("Enter a valid teacher email address.")
    if len(password) < 8:
        raise ValueError("The password must contain at least 8 characters.")

    with get_database_connection() as connection:
        # The question marks safely pass values separately from the SQL command.
        connection.execute(
            """
            INSERT INTO teachers (email, password, is_active)
            VALUES (?, ?, 1)
            ON CONFLICT(email) DO UPDATE SET
                password = excluded.password,
                is_active = 1
            """,
            (email, generate_password_hash(password)),
        )

    print(f"Added access for {email}")


def remove_teacher(email):
    # Soft removal changes is_active to 0 instead of deleting the account.
    setup_database()
    email = email.strip().lower()

    with get_database_connection() as connection:
        # Keeping the row means the account can easily be turned back on later.
        connection.execute(
            "UPDATE teachers SET is_active = 0 WHERE email = ?",
            (email,),
        )

    print(f"Removed access for {email}")


def list_teachers():
    # Sort accounts by email so the terminal list is easier to check.
    setup_database()

    with get_database_connection() as connection:
        teachers = connection.execute(
            "SELECT email, is_active FROM teachers ORDER BY email"
        ).fetchall()

    for teacher in teachers:
        # Change the database number into a word that is easier to understand.
        status = "active" if teacher["is_active"] else "removed"
        print(f"{teacher['email']} | {status}")


def main():
    # argparse reads commands typed after the file name in the terminal.
    parser = argparse.ArgumentParser(description="Manage StudentNET teachers.")
    subparsers = parser.add_subparsers(dest="command", required=True)

    add_parser = subparsers.add_parser("add")
    # Example: python backend/manage_teachers.py add teacher@osc.school.nz password123
    add_parser.add_argument("email")
    add_parser.add_argument("password")

    remove_parser = subparsers.add_parser("remove")
    # Example: python backend/manage_teachers.py remove teacher@osc.school.nz
    remove_parser.add_argument("email")

    # Example: python backend/manage_teachers.py list
    subparsers.add_parser("list")

    args = parser.parse_args()

    # Run the function that matches the chosen terminal command.
    try:
        if args.command == "add":
            add_teacher(args.email, args.password)
        elif args.command == "remove":
            remove_teacher(args.email)
        elif args.command == "list":
            list_teachers()
    except ValueError as error:
        parser.error(str(error))


if __name__ == "__main__":
    # Only run the command menu when this file is opened directly.
    main()
