from __future__ import annotations

from typing import List


def chunk_text(text: str, chunk_size: int = 600, overlap: int = 120) -> List[str]:
    text = (text or "").strip()
    if not text:
        return []
    if overlap >= chunk_size:
        raise ValueError("overlap must be smaller than chunk_size")

    chunks: list[str] = []
    start = 0
    n = len(text)
    while start < n:
        end = min(n, start + chunk_size)
        piece = text[start:end].strip()
        if piece:
            chunks.append(piece)
        if end >= n:
            break
        start = end - overlap
    return chunks
