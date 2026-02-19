from __future__ import annotations

from pathlib import Path
from typing import Iterable

_MD_PATTERNS = ("*.md", "*.markdown")


def iter_markdown_files(root: str | Path) -> Iterable[Path]:
    base = Path(root)
    seen: set[Path] = set()
    for pattern in _MD_PATTERNS:
        for p in base.rglob(pattern):
            if p.is_file() and p not in seen:
                seen.add(p)
                yield p


def load_markdown(path: str | Path) -> str:
    text = Path(path).read_text(encoding="utf-8", errors="ignore")
    lines = [line.rstrip() for line in text.splitlines()]
    return "\n".join(lines).strip()
