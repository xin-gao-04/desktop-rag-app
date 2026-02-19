from mdrag.chunking import chunk_text


def test_chunk_text_basic():
    text = "a" * 1200
    chunks = chunk_text(text, chunk_size=500, overlap=100)
    assert len(chunks) >= 3
    assert len(chunks[0]) <= 500


def test_chunk_text_overlap_guard():
    try:
        chunk_text("abc", chunk_size=10, overlap=10)
        assert False, "expected ValueError"
    except ValueError:
        pass
