# Zeal 三套知识库测试报告（最终）

时间: 2026-02-16T00:01:35.4093928+08:00

## zeal-qt5
- chunk_count: 330
- source_count: 4
- unique_source_count: 4
- question: Qt5 文档里如何理解 QDoc 命令和文档结构？
- answer_preview: 根据你提供的文档，我发现有两个相关的部分：

1. `Including Code Inline | QDoc Manual 5.15.18` 这个部分描述了如何在QDoc中包含代码。
2. `The \macro command is for documenting a C++ macro.` 这一部分是关于使用 `\macro` 命令来文档C++宏的。

如果你想了解更多关于QDoc命令和文档结构的问题，请提供更具体的信息或问题。
- top_sources:
  - D:\code\desktop-rag-app\test-kbs\zeal-qt5\01_01-qdoc-manual.md
  - D:\code\desktop-rag-app\test-kbs\zeal-qt5\05_06-qdoc-commands-includecodeinline.md
  - D:\code\desktop-rag-app\test-kbs\zeal-qt5\12_13-qdoc-commands-topics.md
  - D:\code\desktop-rag-app\test-kbs\zeal-qt5\10_11-qdoc-commands-specialcontent.md

## zeal-cmake
- chunk_count: 141
- source_count: 4
- unique_source_count: 4
- question: CMake add_custom_command 与 add_custom_target 的核心区别是什么？
- answer_preview: add_custom_command 与 add_custom_target 的核心区别在于：

*   **目标类型**：add_custom_command 用于创建一个自定义命令来生成特定文件或执行某些操作，而 add_custom_target 则用于创建一个可执行目标（通常是程序或工具）。
*   **依赖关系**：add_custom_command 可以指定多个依赖项，包括文件、targets 或 executables 等，而 add_custom_target 则只能指定一个目标。
*   **生命周期**：add_custom_command 的自定义命令在其依赖项完成后立即执行，而 add_custom_tar ...
- top_sources:
  - D:\code\desktop-rag-app\test-kbs\zeal-cmake\07_add_executable.md
  - D:\code\desktop-rag-app\test-kbs\zeal-cmake\06_add_dependencies.md
  - D:\code\desktop-rag-app\test-kbs\zeal-cmake\11_add_test.md
  - D:\code\desktop-rag-app\test-kbs\zeal-cmake\10_add_subdirectory.md

## zeal-cpprefzh
- chunk_count: 69
- source_count: 4
- unique_source_count: 4
- question: C 语言原子操作 atomic_fetch_add 的作用和使用场景是什么？
- answer_preview: 根据提供的上下文，C11标准引入了原子操作.atomic_fetch_add函数是一个新语言特性，它实现了原子加法。

作用：

* 将给定值添加到指定的原子对象中。
* 返回修改后的原子对象的值。

使用场景：

* 在多线程环境下，原子加法可以保证数据的线程安全更新。
* 它可以用于计数器或累积器的实现中。

具体来说，atomic_fetch_add函数有以下特点：

* 原子性：该操作是原子的，确保在多线程环境下数据的一致性更新。
* 加法：它执行给定值与指定原子对象的加法运算，并返回结果。
* 支持类型：该函数支持整数类型和指针类型。
- top_sources:
  - D:\code\desktop-rag-app\test-kbs\zeal-cpprefzh\01_11.md
  - D:\code\desktop-rag-app\test-kbs\zeal-cpprefzh\07_atomic.md
  - D:\code\desktop-rag-app\test-kbs\zeal-cpprefzh\05_99.md
  - D:\code\desktop-rag-app\test-kbs\zeal-cpprefzh\08_chrono.md

