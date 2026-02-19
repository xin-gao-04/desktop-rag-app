from __future__ import annotations

from pathlib import Path
from typing import Iterable


def iter_markdown_files(root: str | Path) -> Iterable[Path]:
    base = Path(root)
    for p in base.rglob("*.md"):
        if p.is_file():
            yield p


def load_markdown(path: str | Path) -> str:
    text = Path(path).read_text(encoding="utf-8", errors="ignore")
    lines = [line.rstrip() for line in text.splitlines()]
    return "\n".join(lines).strip()
