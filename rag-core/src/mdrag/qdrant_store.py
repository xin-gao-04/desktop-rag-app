from __future__ import annotations

from typing import Iterable

import requests

from .models import Chunk, RetrievedChunk

try:
    from qdrant_client import QdrantClient
    from qdrant_client.http import models
except Exception:  # pragma: no cover
    QdrantClient = None
    models = None


class QdrantStore:
    def __init__(self, url: str, collection: str, api_key: str = "") -> None:
        self.url = url
        self.collection = collection
        self.api_key = api_key or None
        self._use_sdk = QdrantClient is not None and models is not None
        self._client = QdrantClient(url=self.url, api_key=self.api_key) if self._use_sdk else None

    @staticmethod
    def _point_id(chunk_id: str) -> int:
        # Qdrant accepts integer/uuid ids. Use stable positive integer derived from chunk id.
        key = str(chunk_id or "")
        if not key:
            return 0
        return int(key[:15], 16) if all(c in "0123456789abcdef" for c in key[:15].lower()) else abs(hash(key))

    def _headers(self) -> dict:
        h = {"Content-Type": "application/json"}
        if self.api_key:
            h["api-key"] = self.api_key
        return h

    def _rest(self, method: str, endpoint: str, payload=None, timeout: int = 20):
        resp = requests.request(
            method=method.upper(),
            url=f"{self.url.rstrip('/')}{endpoint}",
            headers=self._headers(),
            json=payload,
            timeout=timeout,
        )
        if resp.status_code < 200 or resp.status_code >= 300:
            raise RuntimeError(f"qdrant {method.upper()} {endpoint} failed: {resp.status_code} {resp.text}")
        return resp.json() if resp.text else {}

    def _collection_exists(self) -> bool:
        if not self._use_sdk:
            try:
                data = self._rest("GET", "/collections")
                cols = data.get("result", {}).get("collections", [])
                names = {x.get("name") for x in cols if isinstance(x, dict)}
                return self.collection in names
            except Exception:
                return False
        try:
            return bool(self._client.collection_exists(self.collection))
        except Exception:
            try:
                self._client.get_collection(self.collection)
                return True
            except Exception:
                return False

    def _ensure_collection(self, vector_size: int | None = None) -> None:
        if self._collection_exists():
            return
        if not vector_size or vector_size <= 0:
            return
        if not self._use_sdk:
            self._rest(
                "PUT",
                f"/collections/{self.collection}",
                payload={
                    "vectors": {
                        "size": int(vector_size),
                        "distance": "Cosine",
                    }
                },
            )
            return
        self._client.create_collection(
            collection_name=self.collection,
            vectors_config=models.VectorParams(size=vector_size, distance=models.Distance.COSINE),
        )

    def _match_filter(self, kb_id: str | None):
        if kb_id is None:
            return None
        return models.Filter(
            must=[
                models.FieldCondition(
                    key="kb_id",
                    match=models.MatchValue(value=kb_id),
                )
            ]
        )

    def clear(self, kb_id: str | None = None) -> None:
        if not self._collection_exists():
            return
        if not self._use_sdk:
            filt = {"must": [{"key": "kb_id", "match": {"value": kb_id}}]} if kb_id is not None else {}
            self._rest(
                "POST",
                f"/collections/{self.collection}/points/delete",
                payload={"filter": filt},
            )
            return
        selector_filter = self._match_filter(kb_id)
        self._client.delete(
            collection_name=self.collection,
            points_selector=models.FilterSelector(filter=selector_filter or models.Filter()),
            wait=True,
        )

    def upsert_chunks(self, chunks: Iterable[Chunk], vectors: list[list[float]], kb_id: str = "default") -> int:
        rows = list(chunks)
        if len(rows) != len(vectors):
            raise ValueError("chunks and vectors length mismatch")
        if not rows:
            return 0

        self._ensure_collection(vector_size=len(vectors[0]))
        if not self._use_sdk:
            points = []
            for chunk, vec in zip(rows, vectors):
                points.append(
                    {
                        "id": self._point_id(chunk.chunk_id),
                        "vector": vec,
                        "payload": {
                            "chunk_id": chunk.chunk_id,
                            "source_path": chunk.source_path,
                            "text": chunk.text,
                            "kb_id": kb_id,
                        },
                    }
                )
            self._rest(
                "PUT",
                f"/collections/{self.collection}/points",
                payload={"points": points},
            )
            return len(rows)
        points = []
        for chunk, vec in zip(rows, vectors):
            points.append(
                models.PointStruct(
                    id=self._point_id(chunk.chunk_id),
                    vector=vec,
                    payload={
                        "chunk_id": chunk.chunk_id,
                        "source_path": chunk.source_path,
                        "text": chunk.text,
                        "kb_id": kb_id,
                    },
                )
            )
        self._client.upsert(collection_name=self.collection, points=points, wait=True)
        return len(rows)

    def all(self, kb_id: str | None = None) -> list[tuple[Chunk, list[float]]]:
        if not self._collection_exists():
            return []
        if not self._use_sdk:
            out: list[tuple[Chunk, list[float]]] = []
            next_offset = None
            while True:
                payload = {
                    "limit": 512,
                    "with_payload": True,
                    "with_vector": True,
                }
                if kb_id is not None:
                    payload["filter"] = {"must": [{"key": "kb_id", "match": {"value": kb_id}}]}
                if next_offset is not None:
                    payload["offset"] = next_offset
                data = self._rest("POST", f"/collections/{self.collection}/points/scroll", payload=payload)
                result = data.get("result", {})
                points = result.get("points", [])
                next_offset = result.get("next_page_offset")
                for p in points:
                    pl = p.get("payload", {}) or {}
                    vector = p.get("vector", []) or []
                    out.append(
                        (
                            Chunk(
                                chunk_id=str(pl.get("chunk_id", p.get("id"))),
                                source_path=str(pl.get("source_path", "")),
                                text=str(pl.get("text", "")),
                            ),
                            list(vector),
                        )
                    )
                if next_offset is None:
                    break
            return out
        out: list[tuple[Chunk, list[float]]] = []
        offset = None
        query_filter = self._match_filter(kb_id)
        while True:
            points, offset = self._client.scroll(
                collection_name=self.collection,
                scroll_filter=query_filter,
                with_payload=True,
                with_vectors=True,
                limit=512,
                offset=offset,
            )
            for p in points:
                payload = p.payload or {}
                chunk = Chunk(
                    chunk_id=str(payload.get("chunk_id", p.id)),
                    source_path=str(payload.get("source_path", "")),
                    text=str(payload.get("text", "")),
                )
                vector = list(p.vector or [])
                out.append((chunk, vector))
            if offset is None:
                break
        return out

    def count(self, kb_id: str | None = None) -> int:
        if not self._collection_exists():
            return 0
        if not self._use_sdk:
            payload = {"exact": True}
            if kb_id is not None:
                payload["filter"] = {"must": [{"key": "kb_id", "match": {"value": kb_id}}]}
            data = self._rest("POST", f"/collections/{self.collection}/points/count", payload=payload)
            return int(data.get("result", {}).get("count", 0))
        query_filter = self._match_filter(kb_id)
        res = self._client.count(collection_name=self.collection, count_filter=query_filter, exact=True)
        return int(res.count or 0)

    def to_retrieved(self, ranked: list[tuple[Chunk, float]]) -> list[RetrievedChunk]:
        return [
            RetrievedChunk(chunk_id=c.chunk_id, source_path=c.source_path, text=c.text, score=s)
            for c, s in ranked
        ]
