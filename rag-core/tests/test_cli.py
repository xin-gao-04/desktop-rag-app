from mdrag.cli import build_parser


def test_cli_has_commands():
    parser = build_parser()
    help_text = parser.format_help()
    assert "index" in help_text
    assert "ask" in help_text
    assert "ask-stream" in help_text
    assert "doctor" in help_text
    assert "rebuild" in help_text
    sub = parser._subparsers._group_actions[0].choices["index"]
    assert "--retrieval-strategy" in sub.format_help()
    assert "--reranker" in sub.format_help()
    assert "--embed-timeout-sec" in sub.format_help()
    assert "--chat-timeout-sec" in sub.format_help()
    assert "--vector-backend" in sub.format_help()
    assert "--qdrant-url" in sub.format_help()
    assert "--qdrant-collection" in sub.format_help()
    assert "--kb-id" in sub.format_help()
