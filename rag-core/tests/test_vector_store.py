from pathlib import Path

from mdrag.models import Chunk
from mdrag.vector_store import VectorStore


def test_vector_store_upsert_and_count(tmp_path: Path):
    db = tmp_path / "index.db"
    store = VectorStore(db)
    chunks = [
        Chunk(chunk_id="c1", source_path="a.md", text="alpha"),
        Chunk(chunk_id="c2", source_path="b.md", text="beta"),
    ]
    vectors = [[1.0, 0.0], [0.0, 1.0]]
    n = store.upsert_chunks(chunks, vectors)
    assert n == 2
    assert store.count() == 2


def test_vector_store_clear(tmp_path: Path):
    db = tmp_path / "index.db"
    store = VectorStore(db)
    store.upsert_chunks([Chunk("c1", "a.md", "x")], [[1.0, 2.0]])
    assert store.count() == 1
    store.clear()
    assert store.count() == 0


def test_vector_store_kb_id_isolation(tmp_path: Path):
    db = tmp_path / "index.db"
    store = VectorStore(db)
    store.upsert_chunks([Chunk("c1", "a.md", "alpha")], [[1.0, 0.0]], kb_id="kb-a")
    store.upsert_chunks([Chunk("c2", "b.md", "beta")], [[0.0, 1.0]], kb_id="kb-b")
    assert store.count(kb_id="kb-a") == 1
    assert store.count(kb_id="kb-b") == 1
    store.clear(kb_id="kb-a")
    assert store.count(kb_id="kb-a") == 0
    assert store.count(kb_id="kb-b") == 1
