from dataclasses import dataclass


@dataclass
class Chunk:
    chunk_id: str
    source_path: str
    text: str


@dataclass
class RetrievedChunk:
    chunk_id: str
    source_path: str
    text: str
    score: float
