# database.py
import sqlite3
from contextlib import contextmanager

DATABASE_PATH = "sphynx.db"


def get_connection():
    conn = sqlite3.connect(DATABASE_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def inicializar_bd():
    with get_connection() as conn:
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS respuestas (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                usuario_id TEXT NOT NULL,
                pregunta_id INTEGER NOT NULL,
                respuesta_seleccionada TEXT NOT NULL,
                es_correcta INTEGER NOT NULL,
                fecha_respuesta TEXT NOT NULL
            )
            """
        )
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS usuarios (
                usuario_id TEXT PRIMARY KEY,
                hearts INTEGER DEFAULT 5,
                streak INTEGER DEFAULT 0,
                last_day TEXT
            )
            """
        )
        conn.commit()