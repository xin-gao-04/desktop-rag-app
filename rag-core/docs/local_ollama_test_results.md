# Local Ollama Test Results

Timestamp: 2026-02-15T01:59:43.1710365+08:00

## 1) Doctor
`
ollama_health=True
models=
- llama3.1:8b
- qwen2.5-coder:3b
- qwen2.5-coder:0.5b-fastcode
- qwen2.5-coder:0.5b
- qwen2.5-coder:1.5b
`

## 2) Index
`
indexed_chunks=3
`

## 3) Ask
`
{
  "question": "����RAG֪ʶ���ִ��������ʲô��",
  "answer": "The execution flow of the local RAG knowledge base is as follows:\n\n1. Confirm model list: `ollama list`\n2. Set module path: `$env:PYTHONPATH = \"$PWD\\\\src\"`\n3. Index docs:\n\t* `python -m mdrag.cli index --knowledge-dir .\\\\knowledge --db .\\\\index.db --embedding-model llama3.1:8b --chat-model llama3.1:8b --clear-first`\n\nAfter indexing, you can ask questions using the `ask` command:\n4. Ask:\n\t* `python -m mdrag.cli ask --db .\\\\index.db --question \"What is the local flow?\" --embedding-model llama3.1:8b --chat-model llama3.1:8b`",
  "sources": [
    "knowledge\\README.md",
    "knowledge\\local_deploy.md",
    "knowledge\\local_deploy.md"
  ],
  "scores": [
    0.20881650152971218,
    0.13066581879628075,
    -0.0006611405284186655
  ]
}
`

## 4) Regression Script
`
Requirement already satisfied: numpy>=1.24 in c:\users\gaoxx\appdata\local\programs\python\python39\lib\site-packages (from -r requirements.txt (line 1)) (1.26.4)
Requirement already satisfied: requests>=2.31 in c:\users\gaoxx\appdata\local\programs\python\python39\lib\site-packages (from -r requirements.txt (line 2)) (2.32.3)
Requirement already satisfied: pytest>=8.0 in c:\users\gaoxx\appdata\local\programs\python\python39\lib\site-packages (from -r requirements.txt (line 3)) (8.4.2)
Requirement already satisfied: urllib3<3,>=1.21.1 in c:\users\gaoxx\appdata\local\programs\python\python39\lib\site-packages (from requests>=2.31->-r requirements.txt (line 2)) (2.3.0)
Requirement already satisfied: idna<4,>=2.5 in c:\users\gaoxx\appdata\local\programs\python\python39\lib\site-packages (from requests>=2.31->-r requirements.txt (line 2)) (3.10)
Requirement already satisfied: certifi>=2017.4.17 in c:\users\gaoxx\appdata\local\programs\python\python39\lib\site-packages (from requests>=2.31->-r requirements.txt (line 2)) (2025.1.31)
Requirement already satisfied: charset-normalizer<4,>=2 in c:\users\gaoxx\appdata\local\programs\python\python39\lib\site-packages (from requests>=2.31->-r requirements.txt (line 2)) (3.4.1)
Requirement already satisfied: exceptiongroup>=1 in c:\users\gaoxx\appdata\local\programs\python\python39\lib\site-packages (from pytest>=8.0->-r requirements.txt (line 3)) (1.2.2)
Requirement already satisfied: packaging>=20 in c:\users\gaoxx\appdata\local\programs\python\python39\lib\site-packages (from pytest>=8.0->-r requirements.txt (line 3)) (24.2)
Requirement already satisfied: iniconfig>=1 in c:\users\gaoxx\appdata\local\programs\python\python39\lib\site-packages (from pytest>=8.0->-r requirements.txt (line 3)) (2.1.0)
Requirement already satisfied: colorama>=0.4 in c:\users\gaoxx\appdata\local\programs\python\python39\lib\site-packages (from pytest>=8.0->-r requirements.txt (line 3)) (0.4.6)
Requirement already satisfied: pluggy<2,>=1.5 in c:\users\gaoxx\appdata\local\programs\python\python39\lib\site-packages (from pytest>=8.0->-r requirements.txt (line 3)) (1.6.0)
Requirement already satisfied: pygments>=2.7.2 in c:\users\gaoxx\appdata\local\programs\python\python39\lib\site-packages (from pytest>=8.0->-r requirements.txt (line 3)) (2.19.2)
Requirement already satisfied: tomli>=1 in c:\users\gaoxx\appdata\local\programs\python\python39\lib\site-packages (from pytest>=8.0->-r requirements.txt (line 3)) (2.4.0)
Could not fetch URL https://pypi.org/simple/pip/: There was a problem confirming the ssl certificate: HTTPSConnectionPool(host='pypi.org', port=443): Max retries exceeded with url: /simple/pip/ (Caused by SSLError(SSLEOFError(8, 'EOF occurred in violation of protocol (_ssl.c:1129)'))) - skipping
.......                                                                  [100%]
7 passed in 0.24s
Report written to docs/test_report.md
`

## Verdict
- Local Ollama endpoint reachable.
- Local 8B model (llama3.1:8b) used for embedding and generation.
- Markdown indexing and query flow works end-to-end.
- Regression tests passed.
