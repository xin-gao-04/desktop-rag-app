# Plan Analysis: Markdown RAG + Local Ollama 8B

## Goal
Build a fully local RAG pipeline using Markdown as the knowledge source and a local Ollama 8B model for generation.

## Success Criteria
- Ingest markdown files recursively.
- Chunk and index content into a local vector store.
- Retrieve top-k relevant chunks for a query.
- Generate answer using local Ollama model with retrieval context.
- Provide CLI commands for indexing and asking.
- Provide automated tests and regression report.

## Architecture
1. Loader: read markdown files and extract plain text.
2. Chunker: split into overlap-preserving chunks.
3. Embedding Client: call Ollama embed API.
4. Vector Store: local SQLite with chunk metadata + vector JSON.
5. Retriever: cosine similarity ranking in Python.
6. Generator: prompt assembly + Ollama chat/generate API.
7. CLI: `index`, `ask`, `rebuild`, `doctor`.

## Design Decisions
- Storage uses SQLite for portability and deterministic local state.
- Vectors persisted as JSON text for zero native extension dependencies.
- Retrieval compute done in Python/Numpy to avoid DB-specific vector plugins.
- Keep interfaces provider-agnostic through client abstraction.

## Failure Handling
- If Ollama is unavailable, CLI returns actionable diagnostics.
- If embedding model is missing, indexing fails fast with clear command hints.
- Empty index returns guidance to run indexing first.

## Test Strategy
- Unit tests for chunking and vector ranking.
- Integration-lite tests for SQLite store and pipeline with mocked Ollama client.
- CLI smoke tests for command wiring.

## Deliverables
- Working repository with source code.
- Operation docs for setup/run/maintenance.
- Test report with command outputs.
