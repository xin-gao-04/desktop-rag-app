from __future__ import annotations

import argparse
import json
import os
from dataclasses import asdict
from datetime import datetime
from pathlib import Path
from statistics import mean
from typing import Any

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "src"
import sys

if str(SRC) not in sys.path:
    sys.path.insert(0, str(SRC))

from mdrag.config import RagConfig
from mdrag.ollama_client import OllamaClient
from mdrag.pipeline import RagPipeline
from mdrag.vector_store import VectorStore


def load_eval_set(path: Path) -> list[dict[str, Any]]:
    items: list[dict[str, Any]] = []
    for line in path.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line or line.startswith("#"):
            continue
        items.append(json.loads(line))
    return items


def base_name(path: str) -> str:
    name = Path(path).name
    parts = name.split("_", 2)
    if len(parts) == 3 and len(parts[1]) == 10:
        return parts[2]
    return name


def first_hit_rank(retrieved: list[str], expected: set[str]) -> int | None:
    for i, name in enumerate(retrieved, start=1):
        if name in expected:
            return i
    return None


def evaluate_item(result: dict[str, Any], expected_sources: list[str], must_include_any: list[str]) -> dict[str, Any]:
    retrieved = [base_name(x) for x in result.get("sources", [])]
    expected = {x.strip() for x in expected_sources if x.strip()}

    hit = False
    mrr = 0.0
    source_coverage = 0.0
    matched: list[str] = []
    if expected:
        matched = [x for x in retrieved if x in expected]
        hit = len(matched) > 0
        rank = first_hit_rank(retrieved, expected)
        if rank:
            mrr = 1.0 / rank
        source_coverage = len(set(matched)) / len(expected)

    answer = (result.get("answer") or "").lower()
    keyword_recall = 1.0
    if must_include_any:
        keys = [k.lower() for k in must_include_any if k.strip()]
        if keys:
            got = sum(1 for k in keys if k in answer)
            keyword_recall = got / len(keys)

    return {
        "retrieved": retrieved,
        "hit_at_k": hit,
        "mrr": mrr,
        "source_coverage": source_coverage,
        "matched_sources": sorted(set(matched)),
        "answer_keyword_recall": keyword_recall,
    }


def to_markdown(
    rows: list[dict[str, Any]],
    summary: dict[str, Any],
    cfg: RagConfig,
    dataset: Path,
    db: Path,
) -> str:
    lines: list[str] = []
    lines.append(f"# RAG Eval Report ({datetime.now().isoformat(timespec='seconds')})")
    lines.append("")
    lines.append("## Run Config")
    lines.append(f"- dataset: `{dataset}`")
    lines.append(f"- db: `{db}`")
    lines.append(f"- retrieval_strategy: `{cfg.retrieval_strategy}`")
    lines.append(f"- reranker: `{cfg.reranker}`")
    lines.append(f"- top_k: `{cfg.top_k}`")
    lines.append(f"- max_context_chars: `{cfg.max_context_chars}`")
    lines.append("")
    lines.append("## Summary")
    lines.append(f"- cases: `{summary['cases']}`")
    lines.append(f"- hit@k: `{summary['hit_at_k']:.4f}`")
    lines.append(f"- mrr: `{summary['mrr']:.4f}`")
    lines.append(f"- source_coverage: `{summary['source_coverage']:.4f}`")
    lines.append(f"- answer_keyword_recall: `{summary['answer_keyword_recall']:.4f}`")
    lines.append("")
    lines.append("## Per Case")
    for i, row in enumerate(rows, start=1):
        lines.append(f"### {i}. {row['question']}")
        lines.append(f"- expected_sources: `{row['expected_sources']}`")
        lines.append(f"- retrieved: `{row['metrics']['retrieved']}`")
        lines.append(f"- hit@k: `{row['metrics']['hit_at_k']}`")
        lines.append(f"- mrr: `{row['metrics']['mrr']:.4f}`")
        lines.append(f"- source_coverage: `{row['metrics']['source_coverage']:.4f}`")
        lines.append(f"- answer_keyword_recall: `{row['metrics']['answer_keyword_recall']:.4f}`")
        lines.append("")
    return "\n".join(lines)


def run_eval(args: argparse.Namespace) -> int:
    dataset_path = Path(args.dataset).resolve()
    db_path = Path(args.db).resolve()
    out_path = Path(args.out).resolve()

    items = load_eval_set(dataset_path)
    if not items:
        raise RuntimeError(f"empty eval set: {dataset_path}")

    cfg = RagConfig(
        ollama_url=args.ollama_url,
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

    pipeline = RagPipeline(cfg, VectorStore(db_path), OllamaClient(cfg.ollama_url))

    rows: list[dict[str, Any]] = []
    for item in items:
        q = item["question"]
        expected_sources = item.get("expected_sources", [])
        must_include_any = item.get("must_include_any", [])
        result = pipeline.ask(q)
        metrics = evaluate_item(result, expected_sources, must_include_any)
        rows.append(
            {
                "question": q,
                "expected_sources": expected_sources,
                "must_include_any": must_include_any,
                "result": result,
                "metrics": metrics,
            }
        )

    summary = {
        "cases": len(rows),
        "hit_at_k": mean([1.0 if r["metrics"]["hit_at_k"] else 0.0 for r in rows]),
        "mrr": mean([r["metrics"]["mrr"] for r in rows]),
        "source_coverage": mean([r["metrics"]["source_coverage"] for r in rows]),
        "answer_keyword_recall": mean([r["metrics"]["answer_keyword_recall"] for r in rows]),
    }

    out_path.parent.mkdir(parents=True, exist_ok=True)
    md = to_markdown(rows, summary, cfg, dataset_path, db_path)
    out_path.write_text(md, encoding="utf-8")

    json_path = out_path.with_suffix(".json")
    json_path.write_text(
        json.dumps(
            {
                "summary": summary,
                "config": asdict(cfg),
                "dataset": str(dataset_path),
                "db": str(db_path),
                "rows": rows,
            },
            ensure_ascii=False,
            indent=2,
        ),
        encoding="utf-8",
    )

    print(f"eval_report={out_path}")
    print(f"eval_json={json_path}")
    print(json.dumps(summary, ensure_ascii=False))
    return 0


def build_parser() -> argparse.ArgumentParser:
    p = argparse.ArgumentParser(prog="eval_rag")
    p.add_argument("--dataset", default=str(ROOT / "docs" / "eval_set_sample.jsonl"))
    p.add_argument("--db", default=str(ROOT / "index.db"))
    p.add_argument("--out", default=str(ROOT / "docs" / "eval_report_latest.md"))
    p.add_argument("--ollama-url", default="http://127.0.0.1:11434")
    p.add_argument("--embedding-model", default="llama3.1:8b")
    p.add_argument("--chat-model", default="llama3.1:8b")
    p.add_argument("--chunk-size", type=int, default=600)
    p.add_argument("--chunk-overlap", type=int, default=120)
    p.add_argument("--top-k", type=int, default=4)
    p.add_argument("--retrieval-strategy", default="hybrid", choices=["hybrid", "dense", "sparse"])
    p.add_argument("--dense-candidate-multiplier", type=int, default=3)
    p.add_argument("--rrf-k", type=int, default=60)
    p.add_argument("--min-retrieval-score", type=float, default=0.0)
    p.add_argument("--max-context-chars", type=int, default=5000)
    p.add_argument("--bm25-k1", type=float, default=1.5)
    p.add_argument("--bm25-b", type=float, default=0.75)
    p.add_argument("--reranker", default="token_overlap", choices=["token_overlap", "llm_score", "none"])
    p.add_argument("--rerank-top-n", type=int, default=8)
    p.add_argument("--embed-timeout-sec", type=int, default=60)
    p.add_argument("--chat-timeout-sec", type=int, default=180)
    return p


def main() -> int:
    parser = build_parser()
    args = parser.parse_args()
    return run_eval(args)


if __name__ == "__main__":
    raise SystemExit(main())
