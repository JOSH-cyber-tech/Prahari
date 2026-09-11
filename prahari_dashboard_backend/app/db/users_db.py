"""
Minimal SQLite-backed user store for Google sign-in.

Not meant to replace Neo4j (that's fraud-graph data); this just persists
the small set of fields we get back from Google so a session can be
resumed across requests/restarts.
"""

import sqlite3
from pathlib import Path

import os

_DEFAULT_DB_PATH = Path(__file__).resolve().parent.parent.parent / "users.db"
DB_PATH = Path(os.environ.get("USERS_DB_PATH", _DEFAULT_DB_PATH))


def get_connection() -> sqlite3.Connection:
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db() -> None:
    with get_connection() as conn:
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS users (
                google_sub TEXT PRIMARY KEY,
                email TEXT NOT NULL,
                name TEXT NOT NULL,
                picture TEXT,
                role TEXT NOT NULL DEFAULT 'citizen',
                created_at TEXT DEFAULT CURRENT_TIMESTAMP
            )
            """
        )
        # A users.db from before the role column existed won't have it --
        # CREATE TABLE IF NOT EXISTS is a no-op on an existing table, so add
        # it explicitly. Already-applied is the expected steady state, not
        # an error.
        try:
            conn.execute("ALTER TABLE users ADD COLUMN role TEXT NOT NULL DEFAULT 'citizen'")
        except sqlite3.OperationalError:
            pass


# role is recomputed from the government-email allowlist on every login
# (see app/api/auth.py) and passed in here -- this never trusts a role the
# client sent.
def upsert_user(google_sub: str, email: str, name: str, picture: str | None, role: str) -> sqlite3.Row:
    with get_connection() as conn:
        conn.execute(
            """
            INSERT INTO users (google_sub, email, name, picture, role)
            VALUES (?, ?, ?, ?, ?)
            ON CONFLICT(google_sub) DO UPDATE SET
                email = excluded.email,
                name = excluded.name,
                picture = excluded.picture,
                role = excluded.role
            """,
            (google_sub, email, name, picture, role),
        )
        conn.commit()
        row = conn.execute(
            "SELECT * FROM users WHERE google_sub = ?", (google_sub,)
        ).fetchone()
        return row


def get_user(google_sub: str) -> sqlite3.Row | None:
    with get_connection() as conn:
        return conn.execute(
            "SELECT * FROM users WHERE google_sub = ?", (google_sub,)
        ).fetchone()
