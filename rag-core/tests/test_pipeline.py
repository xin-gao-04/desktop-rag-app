from pathlib import Path

from mdrag.config import RagConfig
from mdrag.ollama_client import OllamaClient
from mdrag.pipeline import RagPipeline
from mdrag.vector_store import VectorStore


class FakeOllamaClient(OllamaClient):
    def __init__(self):
        super().__init__("http://fake")

    def embed(self, model: str, texts: list[str], timeout_sec: int = 60) -> list[list[float]]:
        out = []
        for t in texts:
            s = sum(ord(c) for c in t)
            out.append([float(s % 101), float((s // 3) % 97), float(len(t) % 53)])
        return out

    def generate(self, model: str, prompt: str, timeout_sec: int = 120) -> str:
        return "mocked-answer"

    def relevance_score(self, model: str, question: str, passage: str) -> float:
        text = f"{question} {passage}".lower()
        if "deploy" in text:
            return 90.0
        if "index" in text:
            return 80.0
        return 35.0


class RetryAwareFakeClient(FakeOllamaClient):
    def __init__(self):
        super().__init__()
        self._gen_calls = 0

    def generate(self, model: str, prompt: str, timeout_sec: int = 120) -> str:
        self._gen_calls += 1
        if self._gen_calls == 1:
            return "上下文信息不足，请提供更多上下文。"
        return "本地RAG流程：1) doctor 2) index 3) ask。支持加载与卸载知识目录。"


def test_pipeline_index_and_ask(tmp_path: Path):
    knowledge = tmp_path / "knowledge"
    knowledge.mkdir()
    (knowledge / "a.md").write_text("Deployment uses local ollama and markdown index.", encoding="utf-8")
    (knowledge / "b.md").write_text("Run index before asking questions.", encoding="utf-8")

    cfg = RagConfig(chunk_size=100, chunk_overlap=10, top_k=2, retrieval_strategy="hybrid")
    store = VectorStore(tmp_path / "index.db")
    client = FakeOllamaClient()
    pipeline = RagPipeline(cfg, store, client)

    count = pipeline.build_index(knowledge)
    assert count >= 2

    res = pipeline.ask("How do I query?")
    assert res["answer"] == "mocked-answer"
    assert len(res["sources"]) == 2
    assert res["retrieval"]["strategy"] == "hybrid"


def test_pipeline_context_budget(tmp_path: Path):
    knowledge = tmp_path / "knowledge"
    knowledge.mkdir()
    (knowledge / "long.md").write_text(("local rag " * 200).strip(), encoding="utf-8")
    (knowledge / "other.md").write_text(("index flow " * 160).strip(), encoding="utf-8")

    cfg = RagConfig(chunk_size=120, chunk_overlap=20, top_k=2, max_context_chars=300)
    store = VectorStore(tmp_path / "index.db")
    client = FakeOllamaClient()
    pipeline = RagPipeline(cfg, store, client)

    count = pipeline.build_index(knowledge)
    assert count > 0
    res = pipeline.ask("Summarize local rag and index flow.")
    assert isinstance(res["retrieval"]["context_chars"], int)
    assert res["retrieval"]["context_chars"] <= 500


def test_pipeline_reranker_modes(tmp_path: Path):
    knowledge = tmp_path / "knowledge"
    knowledge.mkdir()
    (knowledge / "deploy.md").write_text("Deploy with local ollama and markdown knowledge base.", encoding="utf-8")
    (knowledge / "index.md").write_text("Run index before ask command.", encoding="utf-8")

    cfg = RagConfig(chunk_size=80, chunk_overlap=10, top_k=2, retrieval_strategy="hybrid", reranker="llm_score")
    store = VectorStore(tmp_path / "index.db")
    client = FakeOllamaClient()
    pipeline = RagPipeline(cfg, store, client)
    pipeline.build_index(knowledge)
    res = pipeline.ask("How to deploy?")
    assert res["retrieval"]["reranker"] == "llm_score"
    assert len(res["sources"]) == 2


def test_pipeline_empty_index_guard(tmp_path: Path):
    cfg = RagConfig()
    store = VectorStore(tmp_path / "index.db")
    client = FakeOllamaClient()
    pipeline = RagPipeline(cfg, store, client)
    try:
        pipeline.ask("question")
        assert False, "expected RuntimeError"
    except RuntimeError:
        pass


def test_pipeline_retry_when_context_has_evidence(tmp_path: Path):
    knowledge = tmp_path / "knowledge"
    knowledge.mkdir()
    (knowledge / "flow.md").write_text("流程：1) doctor 2) index 3) ask。支持加载与卸载目录。", encoding="utf-8")

    cfg = RagConfig(chunk_size=80, chunk_overlap=10, top_k=1, retrieval_strategy="hybrid")
    store = VectorStore(tmp_path / "index.db")
    client = RetryAwareFakeClient()
    pipeline = RagPipeline(cfg, store, client)
    pipeline.build_index(knowledge)

    res = pipeline.ask("请总结本地RAG流程和加载卸载能力")
    assert "doctor" in res["answer"]
    assert client._gen_calls >= 2


def test_pipeline_model_only_fallback_when_no_hit(tmp_path: Path):
    knowledge = tmp_path / "knowledge"
    knowledge.mkdir()
    cfg = RagConfig(chunk_size=80, chunk_overlap=10, top_k=1, retrieval_strategy="hybrid")
    store = VectorStore(tmp_path / "index.db")
    client = FakeOllamaClient()
    pipeline = RagPipeline(cfg, store, client)
    pipeline.build_index(knowledge)
    try:
        pipeline.ask("任意问题")
        assert False, "expected RuntimeError for empty index"
    except RuntimeError:
        pass

    (knowledge / "a.md").write_text("这是一条与问题不相关的文本。", encoding="utf-8")
    pipeline.build_index(knowledge, clear_first=True)
    # Enforce no selected hit by disabling backfill threshold behavior.
    pipeline.config.min_retrieval_score = 10.0
    res = pipeline.ask("请给出本地RAG完整步骤")
    assert res["retrieval"]["fallback_mode"] == "model_only"
    assert res["retrieval"]["knowledge_hit"] is False
    assert res["sources"] == []


def test_pipeline_kb_id_isolation(tmp_path: Path):
    knowledge_a = tmp_path / "knowledge_a"
    knowledge_b = tmp_path / "knowledge_b"
    knowledge_a.mkdir()
    knowledge_b.mkdir()
    (knowledge_a / "a.md").write_text("alpha-only content", encoding="utf-8")
    (knowledge_b / "b.md").write_text("beta-only content", encoding="utf-8")

    store = VectorStore(tmp_path / "index.db")
    client = FakeOllamaClient()

    cfg_a = RagConfig(chunk_size=80, chunk_overlap=10, top_k=1, kb_id="kb-a")
    cfg_b = RagConfig(chunk_size=80, chunk_overlap=10, top_k=1, kb_id="kb-b")

    pipeline_a = RagPipeline(cfg_a, store, client)
    pipeline_b = RagPipeline(cfg_b, store, client)

    assert pipeline_a.build_index(knowledge_a, clear_first=True) > 0
    assert pipeline_b.build_index(knowledge_b, clear_first=True) > 0
    assert store.count(kb_id="kb-a") > 0
    assert store.count(kb_id="kb-b") > 0
