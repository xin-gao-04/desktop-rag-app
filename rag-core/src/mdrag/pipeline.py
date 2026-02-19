from __future__ import annotations

import hashlib
import math
import re
from collections import Counter
from pathlib import Path
from typing import Iterable, Iterator

import numpy as np

from .chunking import chunk_text
from .loader import iter_markdown_files, load_markdown
from .models import Chunk, RetrievedChunk
from .ollama_client import OllamaClient
class Retriever:
    def __init__(self, store, config) -> None:
        self.store = store
        self.config = config

    @staticmethod
    def _cosine(a: np.ndarray, b: np.ndarray) -> float:
        denom = np.linalg.norm(a) * np.linalg.norm(b)
        if denom == 0:
            return 0.0
        return float(np.dot(a, b) / denom)

    @staticmethod
    def _tokenize(text: str) -> list[str]:
        if not text:
            return []
        normalized = text.lower()
        tokens: list[str] = []
        tokens.extend(re.findall(r"[a-z0-9_]+", normalized))
        tokens.extend(re.findall(r"[\u4e00-\u9fff]", normalized))
        return tokens

    def _search_dense(self, query_vec: list[float], top_k: int) -> list[RetrievedChunk]:
        rows = self.store.all(kb_id=self.config.kb_id)
        if not rows:
            return []
        q = np.asarray(query_vec, dtype=float)
        ranked: list[tuple[Chunk, float]] = []
        for chunk, vec in rows:
            s = self._cosine(q, np.asarray(vec, dtype=float))
            ranked.append((chunk, s))
        ranked.sort(key=lambda x: x[1], reverse=True)
        return self.store.to_retrieved(ranked[:top_k])

    def _search_sparse(self, question: str, top_k: int) -> list[RetrievedChunk]:
        rows = self.store.all(kb_id=self.config.kb_id)
        if not rows:
            return []

        query_terms = self._tokenize(question)
        if not query_terms:
            return []

        docs: list[tuple[Chunk, Counter, int]] = []
        df: Counter = Counter()
        lengths: list[int] = []

        for chunk, _vec in rows:
            terms = self._tokenize(chunk.text)
            tf = Counter(terms)
            dl = len(terms)
            docs.append((chunk, tf, dl))
            lengths.append(dl)
            for term in tf.keys():
                df[term] += 1

        if not lengths:
            return []

        avgdl = max(sum(lengths) / len(lengths), 1.0)
        n_docs = len(docs)
        k1 = max(self.config.bm25_k1, 0.01)
        b = min(max(self.config.bm25_b, 0.0), 1.0)

        ranked: list[tuple[Chunk, float]] = []
        for chunk, tf, dl in docs:
            score = 0.0
            for term in query_terms:
                if term not in tf:
                    continue
                term_df = df.get(term, 0)
                idf = math.log(1.0 + ((n_docs - term_df + 0.5) / (term_df + 0.5)))
                freq = tf[term]
                denom = freq + k1 * (1.0 - b + b * (dl / avgdl))
                score += idf * ((freq * (k1 + 1.0)) / max(denom, 1e-8))
            if score > 0:
                ranked.append((chunk, score))

        ranked.sort(key=lambda x: x[1], reverse=True)
        return self.store.to_retrieved(ranked[:top_k])

    def search(self, question: str, query_vec: list[float], top_k: int) -> list[RetrievedChunk]:
        strategy = (self.config.retrieval_strategy or "hybrid").lower()
        dense_top = max(top_k * max(self.config.dense_candidate_multiplier, 1), top_k)

        if strategy == "dense":
            return self._search_dense(query_vec, dense_top)
        if strategy == "sparse":
            return self._search_sparse(question, dense_top)

        dense_hits = self._search_dense(query_vec, dense_top)
        sparse_hits = self._search_sparse(question, dense_top)
        return self._fuse_rrf(dense_hits, sparse_hits, max(top_k * 3, top_k))

    def _fuse_rrf(
        self,
        dense_hits: list[RetrievedChunk],
        sparse_hits: list[RetrievedChunk],
        top_k: int,
    ) -> list[RetrievedChunk]:
        k = max(self.config.rrf_k, 1)
        merged: dict[str, dict] = {}

        for rank, hit in enumerate(dense_hits, start=1):
            row = merged.setdefault(
                hit.chunk_id,
                {
                    "chunk": hit,
                    "score": 0.0,
                    "dense_rank": None,
                    "sparse_rank": None,
                },
            )
            row["score"] += 1.0 / (k + rank)
            row["dense_rank"] = rank

        for rank, hit in enumerate(sparse_hits, start=1):
            row = merged.setdefault(
                hit.chunk_id,
                {
                    "chunk": hit,
                    "score": 0.0,
                    "dense_rank": None,
                    "sparse_rank": None,
                },
            )
            row["score"] += 1.0 / (k + rank)
            row["sparse_rank"] = rank

        ranked: list[RetrievedChunk] = []
        for row in merged.values():
            chunk = row["chunk"]
            ranked.append(
                RetrievedChunk(
                    chunk_id=chunk.chunk_id,
                    source_path=chunk.source_path,
                    text=chunk.text,
                    score=float(row["score"]),
                )
            )

        ranked.sort(key=lambda x: x.score, reverse=True)
        return ranked[:top_k]


class RagPipeline:
    def __init__(self, config, store, client: OllamaClient) -> None:
        self.config = config
        self.store = store
        self.client = client

    def build_index(self, knowledge_dir: str | Path, clear_first: bool = False) -> int:
        if clear_first:
            self.store.clear(kb_id=self.config.kb_id)

        chunks: list[Chunk] = []
        for p in iter_markdown_files(knowledge_dir):
            text = load_markdown(p)
            pieces = chunk_text(text, self.config.chunk_size, self.config.chunk_overlap)
            for i, piece in enumerate(pieces):
                key = f"{self.config.kb_id}::{p.resolve()}::{i}::{hashlib.sha1(piece.encode('utf-8')).hexdigest()[:10]}"
                chunk_id = hashlib.sha1(key.encode("utf-8")).hexdigest()
                chunks.append(Chunk(chunk_id=chunk_id, source_path=str(p), text=piece))

        if not chunks:
            return 0
        vectors = self.client.embed(
            self.config.embedding_model,
            [c.text for c in chunks],
            timeout_sec=self.config.embed_timeout_sec,
        )
        return self.store.upsert_chunks(chunks, vectors, kb_id=self.config.kb_id)

    def ask(self, question: str) -> dict:
        plan = self._prepare_answer(question)
        answer = self.client.generate(self.config.chat_model, plan["prompt"], timeout_sec=self.config.chat_timeout_sec)
        if self._needs_answer_retry(answer) and self._has_workflow_evidence(question, plan["context"]):
            retry_prompt = (
                "Rewrite the answer using only the provided Context.\n"
                "Requirements:\n"
                "- Give concrete steps/capabilities directly when evidence exists.\n"
                "- Do not output generic 'insufficient context' wording if relevant evidence is present.\n"
                "- Keep the same language as the question.\n"
                "- Include short inline source hints like [README.md].\n\n"
                f"Question:\n{question}\n\n"
                f"Context:\n{plan['context']}\n\n"
                "Improved Answer:"
            )
            answer = self.client.generate(self.config.chat_model, retry_prompt, timeout_sec=self.config.chat_timeout_sec)
        return self._build_result(question, answer, plan)

    def ask_stream(self, question: str) -> Iterator[dict]:
        plan = self._prepare_answer(question)
        yield {
            "event": "meta",
            "data": {
                "retrieval": plan["retrieval"],
                "sources": [h.source_path for h in plan["hits"]],
                "scores": [h.score for h in plan["hits"]],
            },
        }
        parts: list[str] = []
        for chunk in self.client.generate_stream(self.config.chat_model, plan["prompt"], timeout_sec=self.config.chat_timeout_sec):
            parts.append(chunk)
            yield {"event": "delta", "data": {"text": chunk}}
        answer = "".join(parts).strip()
        if self._needs_answer_retry(answer) and self._has_workflow_evidence(question, plan["context"]):
            retry_prompt = (
                "Rewrite the answer using only the provided Context.\n"
                "Requirements:\n"
                "- Give concrete steps/capabilities directly when evidence exists.\n"
                "- Do not output generic 'insufficient context' wording if relevant evidence is present.\n"
                "- Keep the same language as the question.\n"
                "- Include short inline source hints like [README.md].\n\n"
                f"Question:\n{question}\n\n"
                f"Context:\n{plan['context']}\n\n"
                "Improved Answer:"
            )
            improved = self.client.generate(self.config.chat_model, retry_prompt, timeout_sec=self.config.chat_timeout_sec)
            answer = improved.strip() or answer
            yield {"event": "replace", "data": {"text": answer}}
        final = self._build_result(question, answer, plan)
        yield {"event": "done", "data": final}

    def _prepare_answer(self, question: str) -> dict:
        if self.store.count(kb_id=self.config.kb_id) == 0:
            raise RuntimeError("index is empty; run index command first")

        query_vec = self.client.embed(
            self.config.embedding_model,
            [question],
            timeout_sec=self.config.embed_timeout_sec,
        )[0]
        retriever = Retriever(self.store, self.config)
        candidates = retriever.search(question, query_vec, max(self.config.top_k * 4, self.config.top_k))
        reranked = self._rerank_hits(question, candidates)
        hits = self._dedup_hits(reranked, self.config.top_k)
        context, context_meta = self._build_context(hits, self.config.max_context_chars)
        if not context.strip():
            prompt = (
                "You are a helpful assistant.\n"
                "No knowledge-base context is available for this question.\n"
                "Answer directly from the model's general capability, and be explicit that this is model-only output.\n"
                "Use the same language as the question.\n\n"
                f"Question:\n{question}\n\n"
                "Answer:"
            )
            return {
                "hits": [],
                "context": "",
                "retrieval": {
                    "strategy": self.config.retrieval_strategy,
                    "reranker": self.config.reranker,
                    "embed_timeout_sec": self.config.embed_timeout_sec,
                    "chat_timeout_sec": self.config.chat_timeout_sec,
                    "context_chars": 0,
                    "context_truncated": False,
                    "knowledge_hit": False,
                    "fallback_mode": "model_only",
                },
                "prompt": prompt,
            }
        prompt = (
            "You are a local RAG assistant.\n"
            "Rules:\n"
            "1) Answer strictly from Context.\n"
            "2) If context is insufficient, explicitly state what exact field is missing.\n"
            "3) Reply in the same language as the question.\n"
            "4) Prefer structured bullets when question asks for workflow/steps/capabilities.\n"
            "5) Cite source file names in-line when possible (for example: [README.md]).\n"
            "6) Do not claim unavailable facts.\n"
            "7) If Context already contains workflow/steps/load/unload details, answer directly and do not ask the user for more context.\n\n"
            f"Question:\n{question}\n\n"
            f"Context:\n{context}\n\n"
            "Answer:"
        )
        return {
            "hits": hits,
            "context": context,
            "retrieval": {
                "strategy": self.config.retrieval_strategy,
                "reranker": self.config.reranker,
                "embed_timeout_sec": self.config.embed_timeout_sec,
                "chat_timeout_sec": self.config.chat_timeout_sec,
                "context_chars": context_meta["context_chars"],
                "context_truncated": context_meta["truncated"],
                "knowledge_hit": True,
                "fallback_mode": "rag",
            },
            "prompt": prompt,
        }

    @staticmethod
    def _build_result(question: str, answer: str, plan: dict) -> dict:
        return {
            "question": question,
            "answer": answer,
            "sources": [h.source_path for h in plan["hits"]],
            "scores": [h.score for h in plan["hits"]],
            "retrieval": plan["retrieval"],
        }

    @staticmethod
    def _source_key(source_path: str) -> str:
        name = Path(source_path).name
        # Normalize merged file names like: 0_ab12cd34ef_README.md -> README.md
        parts = name.split("_", 2)
        if len(parts) == 3 and len(parts[1]) == 10:
            return parts[2]
        return name

    def _dedup_hits(self, hits: Iterable[RetrievedChunk], top_k: int) -> list[RetrievedChunk]:
        # Allow up to max_per_source chunks from the same file so that long
        # documents aren't reduced to a single passage.
        max_per_source = max(int(getattr(self.config, "max_chunks_per_source", 2) or 2), 1)
        source_counts: dict[str, int] = {}
        out: list[RetrievedChunk] = []
        min_score = float(getattr(self.config, "min_retrieval_score", 0.0) or 0.0)

        for h in list(hits):
            if h.score < min_score:
                continue
            src_key = self._source_key(h.source_path)
            if source_counts.get(src_key, 0) >= max_per_source:
                continue
            source_counts[src_key] = source_counts.get(src_key, 0) + 1
            out.append(h)
            if len(out) >= top_k:
                break

        return out

    def _rerank_hits(self, question: str, hits: list[RetrievedChunk]) -> list[RetrievedChunk]:
        mode = (getattr(self.config, "reranker", "token_overlap") or "token_overlap").lower()
        if mode == "none" or len(hits) <= 1:
            return hits

        cap = max(int(getattr(self.config, "rerank_top_n", 8) or 8), 1)
        target = hits[:cap]
        tail = hits[cap:]

        if mode == "llm_score":
            return self._llm_rerank(question, target) + tail
        return self._token_overlap_rerank(question, target) + tail

    def _token_overlap_rerank(self, question: str, hits: list[RetrievedChunk]) -> list[RetrievedChunk]:
        q_terms = set(Retriever._tokenize(question))
        if not q_terms:
            return hits

        scored: list[tuple[RetrievedChunk, float]] = []
        for rank, h in enumerate(hits, start=1):
            c_terms = set(Retriever._tokenize(h.text))
            overlap = len(q_terms & c_terms) / max(len(q_terms), 1)
            rank_prior = 1.0 / (60 + rank)
            score = (0.7 * overlap) + (0.3 * rank_prior)
            scored.append((h, score))

        scored.sort(key=lambda x: x[1], reverse=True)
        return [
            RetrievedChunk(
                chunk_id=h.chunk_id,
                source_path=h.source_path,
                text=h.text,
                score=float(s),
            )
            for h, s in scored
        ]

    def _llm_rerank(self, question: str, hits: list[RetrievedChunk]) -> list[RetrievedChunk]:
        scored: list[tuple[RetrievedChunk, float]] = []
        for rank, h in enumerate(hits, start=1):
            llm = self.client.relevance_score(self.config.chat_model, question, h.text[:1800]) / 100.0
            rank_prior = 1.0 / (60 + rank)
            score = (0.85 * llm) + (0.15 * rank_prior)
            scored.append((h, score))
        scored.sort(key=lambda x: x[1], reverse=True)
        return [
            RetrievedChunk(
                chunk_id=h.chunk_id,
                source_path=h.source_path,
                text=h.text,
                score=float(s),
            )
            for h, s in scored
        ]

    def _build_context(self, hits: list[RetrievedChunk], max_chars: int) -> tuple[str, dict]:
        budget = max(int(max_chars), 500)
        parts: list[str] = []
        used = 0
        truncated = False

        for h in hits:
            block = f"[source: {h.source_path}] [score: {h.score:.4f}]\n{h.text}\n"
            if used + len(block) <= budget:
                parts.append(block)
                used += len(block)
                continue

            remaining = budget - used
            if remaining > 80:
                parts.append(block[:remaining].rstrip() + "\n[context truncated]\n")
                used = budget
            truncated = True
            break

        return "\n".join(parts), {"context_chars": used, "truncated": truncated}

    @staticmethod
    def _needs_answer_retry(answer: str) -> bool:
        if not answer:
            return True
        text = answer.lower()
        flags = [
            "insufficient context",
            "not enough context",
            "provide more context",
            "无法提供",
            "更多上下文",
            "信息不足",
            "无法准确回答",
        ]
        return any(x in text for x in flags)

    @staticmethod
    def _has_workflow_evidence(question: str, context: str) -> bool:
        q = (question or "").lower()
        c = (context or "").lower()
        topic_keys = ["流程", "步骤", "workflow", "step", "加载", "卸载", "load", "unload", "index", "doctor"]
        if not any(k in q for k in topic_keys):
            return False
        evidence_keys = ["步骤", "workflow", "doctor", "index", "ask", "加载", "卸载", "add", "remove"]
        hit = 0
        for k in evidence_keys:
            if k in c:
                hit += 1
            if hit >= 2:
                return True
        return False
