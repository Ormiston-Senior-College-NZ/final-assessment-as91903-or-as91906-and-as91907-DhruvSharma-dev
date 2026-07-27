import argparse
import os
import sqlite3


BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATABASE_FILE = os.path.join(BASE_DIR, "studentnet.db")


def get_database_connection():
    # Open the same SQLite database used by the Flask app.
    connection = sqlite3.connect(DATABASE_FILE)
    connection.row_factory = sqlite3.Row
    return connection


def setup_database():
    # Make sure the teachers table exists before editing accounts.
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
    # Add a new teacher, or reactivate/update them if the email already exists.
    setup_database()

    with get_database_connection() as connection:
        # ON CONFLICT means the same email can be updated instead of duplicated.
        connection.execute(
            """
            INSERT INTO teachers (email, password, is_active)
            VALUES (?, ?, 1)
            ON CONFLICT(email) DO UPDATE SET
                password = excluded.password,
                is_active = 1
            """,
            (email.lower(), password),
        )

    print(f"Added access for {email.lower()}")


def remove_teacher(email):
    # Keep the teacher in the database, but stop them from logging in.
    setup_database()

    with get_database_connection() as connection:
        # This keeps a record of the teacher while disabling their access.
        connection.execute(
            "UPDATE teachers SET is_active = 0 WHERE email = ?",
            (email.lower(),),
        )

    print(f"Removed access for {email.lower()}")


def list_teachers():
    # Print all teacher accounts so access can be checked from the terminal.
    setup_database()

    with get_database_connection() as connection:
        teachers = connection.execute(
            "SELECT email, password, is_active FROM teachers ORDER BY email"
        ).fetchall()

    for teacher in teachers:
        status = "active" if teacher["is_active"] else "removed"
        print(f"{teacher['email']} | {teacher['password']} | {status}")


def main():
    # Define the terminal commands: add, remove, and list.
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

    if args.command == "add":
        add_teacher(args.email, args.password)
    elif args.command == "remove":
        remove_teacher(args.email)
    elif args.command == "list":
        list_teachers()


if __name__ == "__main__":
    main()
