from __future__ import annotations

import re
from typing import List


def _split_markdown(text: str) -> list[str]:
    """Split on Markdown heading and blank-line (paragraph) boundaries."""
    # Split before any heading line (## Title) or on 2+ consecutive newlines.
    parts = re.split(r"\n(?=#{1,6}\s)|\n{2,}", text)
    return [p.strip() for p in parts if p.strip()]


def _char_split(text: str, chunk_size: int, overlap: int) -> list[str]:
    """Character-based split with overlap, used as fallback for oversized segments."""
    if len(text) <= chunk_size:
        return [text]
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


def chunk_text(text: str, chunk_size: int = 600, overlap: int = 120) -> List[str]:
    """
    Split *text* into overlapping chunks respecting Markdown structure.

    Strategy:
    1. Split on heading (##/###/…) and paragraph (blank line) boundaries.
    2. Greedily merge adjacent segments while they fit within *chunk_size*.
    3. Segments that still exceed *chunk_size* are split with character-based
       sliding window (overlap preserved).
    """
    text = (text or "").strip()
    if not text:
        return []
    if overlap >= chunk_size:
        raise ValueError("overlap must be smaller than chunk_size")

    segments = _split_markdown(text)
    chunks: list[str] = []
    current = ""

    for seg in segments:
        candidate = (current + "\n\n" + seg).strip() if current else seg
        if len(candidate) <= chunk_size:
            current = candidate
        else:
            if current:
                chunks.extend(_char_split(current, chunk_size, overlap))
            # The new segment itself might be oversized; handled by _char_split.
            current = seg

    if current:
        chunks.extend(_char_split(current, chunk_size, overlap))

    return chunks
