from __future__ import annotations

import re
from collections.abc import Iterator
import json

import requests


class OllamaClient:
    def __init__(self, base_url: str) -> None:
        self.base_url = base_url.rstrip("/")
        self._session = requests.Session()
        # Bypass system/environment proxy so localhost Ollama is always reachable
        # even when tools like Clash or system proxy settings are active.
        self._session.trust_env = False

    def health(self) -> bool:
        try:
            r = self._session.get(f"{self.base_url}/api/tags", timeout=5)
            return r.ok
        except requests.RequestException:
            return False

    def list_models(self) -> list[str]:
        r = self._session.get(f"{self.base_url}/api/tags", timeout=10)
        r.raise_for_status()
        data = r.json()
        return [m.get("name", "") for m in data.get("models", [])]

    def embed(self, model: str, texts: list[str], timeout_sec: int = 60, batch_size: int = 32) -> list[list[float]]:
        """Embed texts in batches using Ollama /api/embed batch input."""
        if not texts:
            return []
        safe_timeout = max(int(timeout_sec or 60), 10)
        results: list[list[float]] = []
        for i in range(0, len(texts), batch_size):
            batch = texts[i : i + batch_size]
            r = self._session.post(
                f"{self.base_url}/api/embed",
                json={"model": model, "input": batch},
                timeout=safe_timeout,
            )
            r.raise_for_status()
            data = r.json()
            embeddings = data.get("embeddings", [])
            if len(embeddings) != len(batch):
                raise RuntimeError(f"expected {len(batch)} embeddings, got {len(embeddings)}")
            results.extend(embeddings)
        return results

    def generate(self, model: str, prompt: str, timeout_sec: int = 120) -> str:
        safe_timeout = max(int(timeout_sec or 120), 10)
        r = self._session.post(
            f"{self.base_url}/api/generate",
            json={"model": model, "prompt": prompt, "stream": False},
            timeout=safe_timeout,
        )
        r.raise_for_status()
        data = r.json()
        return data.get("response", "").strip()

    def generate_stream(self, model: str, prompt: str, timeout_sec: int = 120) -> Iterator[str]:
        safe_timeout = max(int(timeout_sec or 120), 10)
        with self._session.post(
            f"{self.base_url}/api/generate",
            json={"model": model, "prompt": prompt, "stream": True},
            timeout=safe_timeout,
            stream=True,
        ) as r:
            r.raise_for_status()
            for raw in r.iter_lines(decode_unicode=True):
                if not raw:
                    continue
                data = json.loads(raw)
                chunk = data.get("response", "")
                if chunk:
                    yield chunk

    def relevance_score(self, model: str, question: str, passage: str) -> float:
        prompt = (
            "You are a relevance scorer for retrieval.\n"
            "Task: score how relevant the PASSAGE is to the QUESTION from 0 to 100.\n"
            "Output: only a number, no explanation.\n\n"
            f"QUESTION:\n{question}\n\n"
            f"PASSAGE:\n{passage}\n\n"
            "SCORE:"
        )
        raw = self.generate(model, prompt, timeout_sec=90)
        m = re.search(r"[-+]?\d*\.?\d+", raw)
        if not m:
            return 0.0
        value = float(m.group(0))
        if value < 0:
            return 0.0
        if value > 100:
            return 100.0
        return value
