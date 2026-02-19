from __future__ import annotations

import json
import sqlite3
from pathlib import Path
from typing import Iterable

from .models import Chunk, RetrievedChunk


class VectorStore:
    def __init__(self, db_path: str | Path) -> None:
        self.db_path = str(db_path)
        self._init_db()

    def _connect(self) -> sqlite3.Connection:
        return sqlite3.connect(self.db_path)

    def _init_db(self) -> None:
        with self._connect() as con:
            con.execute(
                """
                CREATE TABLE IF NOT EXISTS chunks (
                  chunk_id TEXT PRIMARY KEY,
                  kb_id TEXT NOT NULL DEFAULT 'default',
                  source_path TEXT NOT NULL,
                  text TEXT NOT NULL,
                  vector_json TEXT NOT NULL
                )
                """
            )
            cols = con.execute("PRAGMA table_info(chunks)").fetchall()
            col_names = {str(x[1]) for x in cols}
            if "kb_id" not in col_names:
                con.execute("ALTER TABLE chunks ADD COLUMN kb_id TEXT NOT NULL DEFAULT 'default'")
            con.execute("CREATE INDEX IF NOT EXISTS idx_chunks_kb_id ON chunks(kb_id)")
            con.commit()

    def clear(self, kb_id: str | None = None) -> None:
        with self._connect() as con:
            if kb_id is None:
                con.execute("DELETE FROM chunks")
            else:
                con.execute("DELETE FROM chunks WHERE kb_id = ?", (kb_id,))
            con.commit()

    def upsert_chunks(self, chunks: Iterable[Chunk], vectors: list[list[float]], kb_id: str = "default") -> int:
        rows = list(chunks)
        if len(rows) != len(vectors):
            raise ValueError("chunks and vectors length mismatch")

        with self._connect() as con:
            for chunk, vec in zip(rows, vectors):
                con.execute(
                    """
                    INSERT INTO chunks (chunk_id, kb_id, source_path, text, vector_json)
                    VALUES (?, ?, ?, ?, ?)
                    ON CONFLICT(chunk_id) DO UPDATE SET
                      kb_id=excluded.kb_id,
                      source_path=excluded.source_path,
                      text=excluded.text,
                      vector_json=excluded.vector_json
                    """,
                    (chunk.chunk_id, kb_id, chunk.source_path, chunk.text, json.dumps(vec)),
                )
            con.commit()
        return len(rows)

    def all(self, kb_id: str | None = None) -> list[tuple[Chunk, list[float]]]:
        with self._connect() as con:
            if kb_id is None:
                cur = con.execute("SELECT chunk_id, source_path, text, vector_json FROM chunks")
            else:
                cur = con.execute(
                    "SELECT chunk_id, source_path, text, vector_json FROM chunks WHERE kb_id = ?",
                    (kb_id,),
                )
            rows = cur.fetchall()
        out: list[tuple[Chunk, list[float]]] = []
        for chunk_id, source_path, text, vector_json in rows:
            out.append((Chunk(chunk_id=chunk_id, source_path=source_path, text=text), json.loads(vector_json)))
        return out

    def count(self, kb_id: str | None = None) -> int:
        with self._connect() as con:
            if kb_id is None:
                cur = con.execute("SELECT COUNT(*) FROM chunks")
            else:
                cur = con.execute("SELECT COUNT(*) FROM chunks WHERE kb_id = ?", (kb_id,))
            return int(cur.fetchone()[0])

    def to_retrieved(self, ranked: list[tuple[Chunk, float]]) -> list[RetrievedChunk]:
        return [
            RetrievedChunk(chunk_id=c.chunk_id, source_path=c.source_path, text=c.text, score=s)
            for c, s in ranked
        ]
