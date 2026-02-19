from __future__ import annotations

import re
from collections.abc import Iterator
import json

import requests


class OllamaClient:
    def __init__(self, base_url: str) -> None:
        self.base_url = base_url.rstrip("/")

    def health(self) -> bool:
        try:
            r = requests.get(f"{self.base_url}/api/tags", timeout=5)
            return r.ok
        except requests.RequestException:
            return False

    def list_models(self) -> list[str]:
        r = requests.get(f"{self.base_url}/api/tags", timeout=10)
        r.raise_for_status()
        data = r.json()
        return [m.get("name", "") for m in data.get("models", [])]

    def embed(self, model: str, texts: list[str], timeout_sec: int = 60) -> list[list[float]]:
        safe_timeout = max(int(timeout_sec or 60), 10)
        vectors: list[list[float]] = []
        for text in texts:
            r = requests.post(
                f"{self.base_url}/api/embed",
                json={"model": model, "input": text},
                timeout=safe_timeout,
            )
            r.raise_for_status()
            data = r.json()
            emb = data.get("embeddings", [])
            if not emb:
                raise RuntimeError("empty embedding returned")
            vectors.append(emb[0])
        return vectors

    def generate(self, model: str, prompt: str, timeout_sec: int = 120) -> str:
        safe_timeout = max(int(timeout_sec or 120), 10)
        r = requests.post(
            f"{self.base_url}/api/generate",
            json={"model": model, "prompt": prompt, "stream": False},
            timeout=safe_timeout,
        )
        r.raise_for_status()
        data = r.json()
        return data.get("response", "").strip()

    def generate_stream(self, model: str, prompt: str, timeout_sec: int = 120) -> Iterator[str]:
        safe_timeout = max(int(timeout_sec or 120), 10)
        with requests.post(
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
