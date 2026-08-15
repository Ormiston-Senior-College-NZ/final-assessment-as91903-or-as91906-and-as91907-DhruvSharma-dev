"""Tests for the StudentNET database and Flask routes.

These tests check teacher logins, saved content, announcements, curriculum data,
foreign keys, invalid input and the process for moving older data into new tables.
"""

import io
import os
import sqlite3
import tempfile
import unittest
from contextlib import redirect_stdout

import app as studentnet_app
import manage_teachers
from werkzeug.security import check_password_hash


class DatabaseApiTests(unittest.TestCase):
    """Test Flask using a separate temporary database each time."""

    def setUp(self):
        # Every test receives a new database file, protecting real StudentNET data
        # and preventing one test's inserted rows from affecting another test.
        self.temporary_directory = tempfile.TemporaryDirectory()
        self.database_file = os.path.join(
            self.temporary_directory.name,
            "studentnet-test.db",
        )
        studentnet_app.DATABASE_FILE = self.database_file
        manage_teachers.DATABASE_FILE = self.database_file
        studentnet_app.app.config.update(TESTING=True, SECRET_KEY="test-secret")
        studentnet_app.setup_database()
        self.client = studentnet_app.app.test_client()

    def tearDown(self):
        # Delete the temporary database after each test.
        self.temporary_directory.cleanup()

    def database_connection(self):
        # Direct connections are used only when a test must inspect stored rows.
        connection = sqlite3.connect(self.database_file)
        connection.row_factory = sqlite3.Row
        return connection

    def login(self, email="teacher@osc.school.nz", password="studentnet2026"):
        # Reuse the normal login route so protected CRUD tests include sessions.
        return self.client.post(
            "/api/login",
            json={"email": email, "password": password},
        )

    # Authentication tests cover stored hashes, invalid input and account status.
    def test_starter_password_is_hashed_and_login_succeeds(self):
        with self.database_connection() as connection:
            teacher = connection.execute(
                "SELECT password FROM teachers WHERE email = ?",
                ("teacher@osc.school.nz",),
            ).fetchone()

        self.assertNotEqual(teacher["password"], "studentnet2026")
        self.assertTrue(check_password_hash(teacher["password"], "studentnet2026"))
        self.assertEqual(self.login().status_code, 200)

    def test_invalid_and_disabled_logins_are_rejected(self):
        self.assertEqual(self.login(password="incorrect-password").status_code, 401)
        manage_teachers.remove_teacher("teacher@osc.school.nz")
        self.assertEqual(self.login().status_code, 401)

    def test_missing_login_fields_are_rejected(self):
        response = self.client.post("/api/login", json={"email": ""})
        self.assertEqual(response.status_code, 400)

    # Generic content tests cover the smaller sections that intentionally remain
    # JSON because their values are edited and displayed as complete collections.
    def test_content_update_requires_active_session(self):
        response = self.client.put(
            "/api/content/studentnet-whats-on-this-week",
            json={"value": []},
        )
        self.assertEqual(response.status_code, 401)

    def test_authorised_content_can_be_saved_and_read(self):
        self.login()
        value = [{"id": "notice-1", "title": "Testing"}]
        save_response = self.client.put(
            "/api/content/studentnet-whats-on-this-week",
            json={"value": value},
        )
        read_response = self.client.get(
            "/api/content/studentnet-whats-on-this-week"
        )

        self.assertEqual(save_response.status_code, 200)
        self.assertEqual(read_response.status_code, 200)
        self.assertEqual(read_response.get_json()["value"], value)
        self.assertEqual(
            read_response.get_json()["updated_by"],
            "teacher@osc.school.nz",
        )
        self.assertIsNotNone(read_response.get_json()["updated_at"])

    def test_save_creates_joined_audit_history(self):
        self.login()
        first_value = [{"id": "notice-1", "title": "First version"}]
        second_value = [{"id": "notice-1", "title": "Second version"}]

        self.client.put(
            "/api/content/studentnet-whats-on-this-week",
            json={"value": first_value},
        )
        self.client.put(
            "/api/content/studentnet-whats-on-this-week",
            json={"value": second_value},
        )
        response = self.client.get(
            "/api/content/studentnet-whats-on-this-week/history"
        )

        self.assertEqual(response.status_code, 200)
        history = response.get_json()["history"]
        self.assertEqual(len(history), 2)
        self.assertEqual(history[0]["new_value"], second_value)
        self.assertEqual(history[0]["previous_value"], first_value)
        self.assertEqual(history[0]["changed_by"], "teacher@osc.school.nz")

    def test_history_requires_teacher_login(self):
        response = self.client.get(
            "/api/content/studentnet-whats-on-this-week/history"
        )
        self.assertEqual(response.status_code, 401)

    def test_foreign_keys_are_enabled_and_declared(self):
        with studentnet_app.get_database_connection() as connection:
            foreign_keys_enabled = connection.execute(
                "PRAGMA foreign_keys"
            ).fetchone()[0]
            content_relationships = connection.execute(
                "PRAGMA foreign_key_list(content)"
            ).fetchall()
            history_relationships = connection.execute(
                "PRAGMA foreign_key_list(content_history)"
            ).fetchall()

        self.assertEqual(foreign_keys_enabled, 1)
        self.assertEqual(len(content_relationships), 1)
        self.assertEqual(len(history_relationships), 2)

    def test_invalid_shape_and_unknown_content_key_are_rejected(self):
        self.login()
        invalid_response = self.client.put(
            "/api/content/studentnet-whats-on-this-week",
            json={"value": {"not": "a list"}},
        )
        unknown_response = self.client.get("/api/content/not-a-real-section")

        self.assertEqual(invalid_response.status_code, 400)
        self.assertEqual(unknown_response.status_code, 404)

    def test_missing_content_returns_404(self):
        response = self.client.get("/api/content/studentnet-whats-on-this-week")
        self.assertEqual(response.status_code, 404)

    def test_account_command_hashes_password_and_list_hides_it(self):
        manage_teachers.add_teacher("new.teacher@osc.school.nz", "safe-password")

        with self.database_connection() as connection:
            teacher = connection.execute(
                "SELECT password FROM teachers WHERE email = ?",
                ("new.teacher@osc.school.nz",),
            ).fetchone()

        output = io.StringIO()
        with redirect_stdout(output):
            manage_teachers.list_teachers()

        self.assertTrue(check_password_hash(teacher["password"], "safe-password"))
        self.assertNotIn("safe-password", output.getvalue())
        self.assertIn("new.teacher@osc.school.nz | active", output.getvalue())

    def test_existing_plaintext_password_is_migrated(self):
        with self.database_connection() as connection:
            connection.execute(
                "INSERT INTO teachers (email, password, is_active) VALUES (?, ?, 1)",
                ("legacy@osc.school.nz", "legacy-password"),
            )

        studentnet_app.setup_database()

        with self.database_connection() as connection:
            teacher = connection.execute(
                "SELECT password FROM teachers WHERE email = ?",
                ("legacy@osc.school.nz",),
            ).fetchone()

        self.assertTrue(check_password_hash(teacher["password"], "legacy-password"))

    # Relational announcement tests cover all four CRUD operations and JOIN output.
    def test_announcement_relational_crud_and_teacher_join(self):
        self.assertEqual(
            self.client.post("/api/announcements", json={"title": "Notice"}).status_code,
            401,
        )
        self.login()
        create_response = self.client.post(
            "/api/announcements",
            json={"title": "Database test", "message": "First", "date": "Today"},
        )
        announcement_id = create_response.get_json()["id"]
        read_response = self.client.get("/api/announcements")

        self.assertEqual(create_response.status_code, 201)
        self.assertEqual(read_response.status_code, 200)
        announcement = read_response.get_json()["announcements"][0]
        self.assertEqual(announcement["title"], "Database test")
        self.assertEqual(announcement["updated_by"], "teacher@osc.school.nz")

        update_response = self.client.put(
            f"/api/announcements/{announcement_id}",
            json={"title": "Updated test", "message": "Second", "date": "Tomorrow"},
        )
        self.assertEqual(update_response.status_code, 200)
        self.assertEqual(
            self.client.get("/api/announcements").get_json()["announcements"][0]["title"],
            "Updated test",
        )

        self.assertEqual(
            self.client.delete(f"/api/announcements/{announcement_id}").status_code,
            200,
        )
        empty_response = self.client.get("/api/announcements")
        self.assertEqual(empty_response.status_code, 200)
        self.assertEqual(empty_response.get_json()["announcements"], [])

    def test_announcement_validation_and_missing_id(self):
        self.login()
        self.assertEqual(
            self.client.post("/api/announcements", json={"title": ""}).status_code,
            400,
        )
        self.assertEqual(
            self.client.put("/api/announcements/9999", json={"title": "Missing"}).status_code,
            404,
        )
        self.assertEqual(
            self.client.delete("/api/announcements/9999").status_code,
            404,
        )

    # Curriculum tests prove that one subject can link to several level records.
    def test_subject_many_to_many_crud_and_join_query(self):
        self.login()
        create_response = self.client.post(
            "/api/subjects",
            json={
                "name": "Digital Technologies",
                "description": "Develop digital outcomes.",
                "pathway": "Technology careers.",
                "levels": ["level1", "level2", "level3"],
            },
        )
        subject_id = create_response.get_json()["id"]
        curriculum = self.client.get("/api/curriculum").get_json()["subjects"]

        self.assertEqual(create_response.status_code, 201)
        self.assertEqual(curriculum["level1"][0]["id"], subject_id)
        self.assertEqual(curriculum["level2"][0]["id"], subject_id)
        self.assertEqual(curriculum["level3"][0]["id"], subject_id)
        self.assertCountEqual(
            curriculum["level1"][0]["levels"],
            ["level1", "level2", "level3"],
        )
        self.assertEqual(
            curriculum["level1"][0]["updated_by"],
            "teacher@osc.school.nz",
        )

        with self.database_connection() as connection:
            subject_count = connection.execute(
                "SELECT COUNT(*) FROM subjects WHERE id = ?", (subject_id,)
            ).fetchone()[0]
            relationship_count = connection.execute(
                "SELECT COUNT(*) FROM subject_levels WHERE subject_id = ?",
                (subject_id,),
            ).fetchone()[0]
        self.assertEqual(subject_count, 1)
        self.assertEqual(relationship_count, 3)

        # The Teacher Panel edits one sidebar level at a time. Updating Level 1
        # must not remove or overwrite this subject's Level 2/3 relationships.
        level_edit_response = self.client.put(
            f"/api/subjects/{subject_id}",
            json={
                "name": "Digital Technologies",
                "description": "Level 1 description.",
                "pathway": "Level 1 pathway.",
                "levels": ["level1"],
                "editing_level": "level1",
            },
        )
        level_edited = self.client.get("/api/curriculum").get_json()["subjects"]
        self.assertEqual(level_edit_response.status_code, 200)
        self.assertEqual(level_edited["level1"][0]["description"], "Level 1 description.")
        self.assertEqual(level_edited["level2"][0]["description"], "Develop digital outcomes.")
        self.assertEqual(len(level_edited["level3"]), 1)

        update_response = self.client.put(
            f"/api/subjects/{subject_id}",
            json={
                "name": "Digital Technologies",
                "description": "Updated description.",
                "pathway": "Updated pathway.",
                "levels": ["level2", "level3"],
            },
        )
        updated = self.client.get("/api/curriculum").get_json()["subjects"]
        self.assertEqual(update_response.status_code, 200)
        self.assertEqual(updated["level1"], [])
        self.assertEqual(updated["level2"][0]["description"], "Updated description.")

        delete_response = self.client.delete(
            f"/api/subjects/{subject_id}?level=level2"
        )
        remaining = self.client.get("/api/curriculum").get_json()["subjects"]
        self.assertEqual(delete_response.status_code, 200)
        self.assertEqual(remaining["level2"], [])
        self.assertEqual(len(remaining["level3"]), 1)

    def test_subject_integrity_validation_and_cascade_delete(self):
        self.login()
        invalid_response = self.client.post(
            "/api/subjects",
            json={"name": "Invalid", "levels": ["not-a-level"]},
        )
        self.assertEqual(invalid_response.status_code, 400)

        create_response = self.client.post(
            "/api/subjects",
            json={"name": "Calculus", "levels": ["level2", "level3"]},
        )
        subject_id = create_response.get_json()["id"]
        self.assertEqual(self.client.delete(f"/api/subjects/{subject_id}").status_code, 200)

        with self.database_connection() as connection:
            self.assertEqual(
                connection.execute(
                    "SELECT COUNT(*) FROM subject_levels WHERE subject_id = ?",
                    (subject_id,),
                ).fetchone()[0],
                0,
            )
        self.assertEqual(
            self.client.put(
                "/api/subjects/9999",
                json={"name": "Missing", "levels": ["level1"]},
            ).status_code,
            404,
        )

    # Schema inspection supplements behavior tests by confirming the declared
    # foreign-key relationships match the final ERD.
    def test_normalized_tables_have_expected_foreign_keys(self):
        with studentnet_app.get_database_connection() as connection:
            announcement_keys = connection.execute(
                "PRAGMA foreign_key_list(announcements)"
            ).fetchall()
            subject_keys = connection.execute(
                "PRAGMA foreign_key_list(subjects)"
            ).fetchall()
            junction_keys = connection.execute(
                "PRAGMA foreign_key_list(subject_levels)"
            ).fetchall()

        self.assertEqual(len(announcement_keys), 1)
        self.assertEqual(len(subject_keys), 1)
        self.assertEqual(len(junction_keys), 3)

    # Run setup twice to check that older data is not copied twice.
    def test_json_content_migrates_once_into_normalized_tables(self):
        with self.database_connection() as connection:
            connection.execute("DELETE FROM schema_migrations")
            connection.execute(
                "INSERT INTO content (key, value) VALUES (?, ?)",
                (
                    "studentnet-announcements",
                    '[{"title":"Migrated notice","message":"Saved","date":"Today"}]',
                ),
            )
            connection.execute(
                "INSERT INTO content (key, value) VALUES (?, ?)",
                (
                    "studentnet-curriculum-subjects",
                    '{"level1":[{"name":"English","description":"L1","pathway":"Study"}],'
                    '"level2":[{"name":"English","description":"L2","pathway":"University"}],'
                    '"level3":[],"scholarships":[]}',
                ),
            )

        studentnet_app.setup_database()
        studentnet_app.setup_database()

        with self.database_connection() as connection:
            self.assertEqual(
                connection.execute("SELECT COUNT(*) FROM announcements").fetchone()[0],
                1,
            )
            self.assertEqual(
                connection.execute("SELECT COUNT(*) FROM subjects").fetchone()[0],
                1,
            )
            self.assertEqual(
                connection.execute("SELECT COUNT(*) FROM subject_levels").fetchone()[0],
                2,
            )


if __name__ == "__main__":
    unittest.main()
