from __future__ import annotations

import argparse
import json
import os
from pathlib import Path

from .config import RagConfig
from .ollama_client import OllamaClient
from .pipeline import RagPipeline
from .qdrant_store import QdrantStore
from .vector_store import VectorStore


def _make_store(args):
    backend = str(getattr(args, "vector_backend", "sqlite") or "sqlite").lower()
    if backend == "qdrant":
        return QdrantStore(
            url=args.qdrant_url,
            collection=args.qdrant_collection,
            api_key=args.qdrant_api_key,
        )
    return VectorStore(args.db)


def _make_pipeline(args) -> RagPipeline:
    cfg = RagConfig(
        ollama_url=args.ollama_url,
        vector_backend=args.vector_backend,
        qdrant_url=args.qdrant_url,
        qdrant_api_key=args.qdrant_api_key,
        qdrant_collection=args.qdrant_collection,
        kb_id=args.kb_id,
        embedding_model=args.embedding_model,
        chat_model=args.chat_model,
        chunk_size=args.chunk_size,
        chunk_overlap=args.chunk_overlap,
        top_k=args.top_k,
        retrieval_strategy=args.retrieval_strategy,
        dense_candidate_multiplier=args.dense_candidate_multiplier,
        rrf_k=args.rrf_k,
        min_retrieval_score=args.min_retrieval_score,
        max_context_chars=args.max_context_chars,
        bm25_k1=args.bm25_k1,
        bm25_b=args.bm25_b,
        reranker=args.reranker,
        rerank_top_n=args.rerank_top_n,
        embed_timeout_sec=args.embed_timeout_sec,
        chat_timeout_sec=args.chat_timeout_sec,
    )
    store = _make_store(args)
    client = OllamaClient(cfg.ollama_url)
    return RagPipeline(cfg, store, client)


def cmd_index(args) -> int:
    pipeline = _make_pipeline(args)
    n = pipeline.build_index(args.knowledge_dir, clear_first=args.clear_first)
    print(f"indexed_chunks={n}")
    return 0


def cmd_ask(args) -> int:
    pipeline = _make_pipeline(args)
    result = pipeline.ask(args.question)
    print(json.dumps(result, ensure_ascii=False, indent=2))
    return 0


def cmd_ask_stream(args) -> int:
    pipeline = _make_pipeline(args)
    for evt in pipeline.ask_stream(args.question):
        print(json.dumps(evt, ensure_ascii=False), flush=True)
    return 0


def cmd_doctor(args) -> int:
    client = OllamaClient(args.ollama_url)
    ok = client.health()
    print(f"ollama_health={ok}")
    if ok:
        models = client.list_models()
        print("models=")
        for m in models:
            print(f"- {m}")
    return 0 if ok else 2


def cmd_rebuild(args) -> int:
    if args.vector_backend == "sqlite" and Path(args.db).exists():
        os.remove(args.db)
    pipeline = _make_pipeline(args)
    n = pipeline.build_index(args.knowledge_dir, clear_first=False)
    print(f"rebuild_indexed_chunks={n}")
    return 0


def build_parser() -> argparse.ArgumentParser:
    p = argparse.ArgumentParser(prog="mdrag")
    sub = p.add_subparsers(dest="cmd", required=True)

    def add_common(sp):
        sp.add_argument("--db", default="index.db")
        sp.add_argument("--vector-backend", default="sqlite", choices=["sqlite", "qdrant"])
        sp.add_argument("--qdrant-url", default="http://127.0.0.1:6333")
        sp.add_argument("--qdrant-api-key", default="")
        sp.add_argument("--qdrant-collection", default="mdrag_chunks")
        sp.add_argument("--kb-id", default="default")
        sp.add_argument("--ollama-url", default="http://127.0.0.1:11434")
        sp.add_argument("--embedding-model", default="llama3.1:8b")
        sp.add_argument("--chat-model", default="llama3.1:8b")
        sp.add_argument("--chunk-size", type=int, default=600)
        sp.add_argument("--chunk-overlap", type=int, default=120)
        sp.add_argument("--top-k", type=int, default=4)
        sp.add_argument("--retrieval-strategy", default="hybrid", choices=["hybrid", "dense", "sparse"])
        sp.add_argument("--dense-candidate-multiplier", type=int, default=3)
        sp.add_argument("--rrf-k", type=int, default=60)
        sp.add_argument("--min-retrieval-score", type=float, default=0.0)
        sp.add_argument("--max-context-chars", type=int, default=5000)
        sp.add_argument("--bm25-k1", type=float, default=1.5)
        sp.add_argument("--bm25-b", type=float, default=0.75)
        sp.add_argument("--reranker", default="token_overlap", choices=["token_overlap", "llm_score", "none"])
        sp.add_argument("--rerank-top-n", type=int, default=8)
        sp.add_argument("--embed-timeout-sec", type=int, default=60)
        sp.add_argument("--chat-timeout-sec", type=int, default=180)

    s_index = sub.add_parser("index")
    add_common(s_index)
    s_index.add_argument("--knowledge-dir", required=True)
    s_index.add_argument("--clear-first", action="store_true")
    s_index.set_defaults(func=cmd_index)

    s_ask = sub.add_parser("ask")
    add_common(s_ask)
    s_ask.add_argument("--question", required=True)
    s_ask.set_defaults(func=cmd_ask)

    s_ask_stream = sub.add_parser("ask-stream")
    add_common(s_ask_stream)
    s_ask_stream.add_argument("--question", required=True)
    s_ask_stream.set_defaults(func=cmd_ask_stream)

    s_doctor = sub.add_parser("doctor")
    s_doctor.add_argument("--ollama-url", default="http://127.0.0.1:11434")
    s_doctor.set_defaults(func=cmd_doctor)

    s_rebuild = sub.add_parser("rebuild")
    add_common(s_rebuild)
    s_rebuild.add_argument("--knowledge-dir", required=True)
    s_rebuild.set_defaults(func=cmd_rebuild)

    return p


def main() -> int:
    parser = build_parser()
    args = parser.parse_args()
    return int(args.func(args))


if __name__ == "__main__":
    raise SystemExit(main())

