# doctor 与索引修复

- `doctor` 命令用于检测和修复本地索引环境。
- 如果 `doctor` 失败，可执行：`python -m mdrag.cli doctor`。
- 如果未找到 chunks，请检查知识目录中是否存在 `.md` 文件并重新执行 `index`。