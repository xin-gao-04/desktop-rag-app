from dataclasses import dataclass


@dataclass
class RagConfig:
    ollama_url: str = "http://127.0.0.1:11434"
    vector_backend: str = "sqlite"  # sqlite|qdrant
    qdrant_url: str = "http://127.0.0.1:6333"
    qdrant_api_key: str = ""
    qdrant_collection: str = "mdrag_chunks"
    kb_id: str = "default"
    embedding_model: str = "llama3.1:8b"
    chat_model: str = "llama3.1:8b"
    chunk_size: int = 600
    chunk_overlap: int = 120
    top_k: int = 4
    retrieval_strategy: str = "hybrid"  # hybrid|dense|sparse
    dense_candidate_multiplier: int = 3
    rrf_k: int = 60
    min_retrieval_score: float = 0.0
    max_context_chars: int = 5000
    bm25_k1: float = 1.5
    bm25_b: float = 0.75
    reranker: str = "token_overlap"  # token_overlap|llm_score|none
    rerank_top_n: int = 8
    embed_timeout_sec: int = 60
    chat_timeout_sec: int = 180

