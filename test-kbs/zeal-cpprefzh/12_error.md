

错误处理

- 

 
 
 

 
 
 
 

 
# 错误处理

 
 
 
 
 来自cppreference.com
 
 
 < c
 
 
 

  C
编译器支持
语言
头文件
类型支持
程序工具
可变参数函数支持
错误处理
动态内存管理
字符串库
算法
数值
日期和时间工具
输入/输出支持
本地化支持
并发支持 (C11)
技术规范
符号索引
 错误处理
 错误码
 错误码 
errno
 断言
assert
static_assert(C11)(C23 移除)
 边界检查
set_constraint_handler_s(C11)
abort_handler_s(C11)
ignore_handler_s(C11)
 

### 错误号

 在标头 <errno.h> 定义 

 errno

 展开成 POSIX 兼容的线程局域错误编号变量
(宏变量) 

 E2BIG, EACCES, ..., EXDEV

 标准 POSIX 兼容的错误条件宏 
 (宏常量) 

### 断言

 在标头 <assert.h> 定义 

 assert

 若用户指定的条件非true，则异常终止程序。可以在发行版本禁用。 
 (宏函数) 

 static_assert(C11)(C23 移除)

 若常量表达式为假则发布编译期诊断 
 (关键词宏)

### 边界检查

标准库提供了一些既存函数的边界检查版本（gets_s、fopen_s、printf_s、strcpy_s、wcscpy_s、mbstowcs_s、qsort_s、getenv_s 等）。这些功能是可选的，并且仅当定义了 __STDC_LIB_EXT1__ 时才可用。下列宏和函数支持此功能。

  

 在标头 <errno.h> 定义 

 在标头 <stdio.h> 定义 

 errno_t(C11)

 对 int 的 typedef，用于返回 errno 值的函数的自描述 
 (typedef)

  

 在标头 <stddef.h> 定义 

 在标头 <stdio.h> 定义 

 在标头 <stdlib.h> 定义 

 在标头 <string.h> 定义 

 在标头 <time.h> 定义 

 在标头 <wchar.h> 定义 

 rsize_t(C11)

 与 size_t 类型相同的 typedef，用于在运行时对其各参数进行范围检查的函数的自描述 
 (typedef)

  

 在标头 <stdint.h> 定义 

 RSIZE_MAX(C11)

 范围检查函数可接受的最大大小，展开成常量或可能在运行时改变的变量（例如，随当前分配的内存大小改变时而改变）
(宏变量)

  

 在标头 <stdlib.h> 定义 

 set_constraint_handler_s(C11)

 设置边界检查函数的出错回调 
 (函数) 

 abort_handler_s(C11)

 边界检查函数的异常中止回调 
 (函数) 

 ignore_handler_s(C11)

 边界检查函数的忽略回调 
 (函数) 

注意：带边界检查函数的实现可于开源库 Safe C 及 Slibc 获得，以及作为 Watcom C 的一部分。亦有一组不兼容的带边界检查函数可于 Visual Studio 获得。

(C11 起)

### 注解

自 C23 起， static_assert 自身是关键词，可能亦为预定义宏，故 <assert.h> 不再提供它。

### 引用

 延伸内容 

 C23 标准（ISO/IEC 9899:2024）：

- 7.2 Diagnostics <assert.h> （第 TBD 页）

- 7.5 Errors <errno.h> （第 TBD 页）

- 7.19 Common definitions <stddef.h> （第 TBD 页）

- 7.20 Integer types <stdint.h> （第 TBD 页）

- 7.21 Input/output <stdio.h> （第 TBD 页）

- 7.22 General utilities <stdlib.h> （第 TBD 页）

- K.3.1.3 Use of errno （第 TBD 页）

- K.3.2/2 errno_t （第 TBD 页）

- K.3.3/2 rsize_t （第 TBD 页）

- K.3.4/2 RSIZE_MAX （第 TBD 页）

- 7.31.3 Errors <errno.h> （第 TBD 页）

- 7.31.10 Integer types <stdint.h> （第 TBD 页）

- 7.31.11 Input/output <stdio.h> （第 TBD 页）

- 7.31.12 General utilities <stdlib.h> （第 TBD 页）

- C17 标准（ISO/IEC 9899:2018）：

- 7.2 Diagnostics <assert.h> （第 TBD 页）

- 7.5 Errors <errno.h> （第 TBD 页）

- 7.19 Common definitions <stddef.h> （第 TBD 页）

- 7.20 Integer types <stdint.h> （第 TBD 页）

- 7.21 Input/output <stdio.h> （第 TBD 页）

- 7.22 General utilities <stdlib.h> （第 TBD 页）

- K.3.1.3 Use of errno （第 TBD 页）

- K.3.2/2 errno_t （第 TBD 页）

- K.3.3/2 rsize_t （第 TBD 页）

- K.3.4/2 RSIZE_MAX （第 TBD 页）

- 7.31.3 Errors <errno.h> （第 TBD 页）

- 7.31.10 Integer types <stdint.h> （第 TBD 页）

- 7.31.11 Input/output <stdio.h> （第 TBD 页）

- 7.31.12 General utilities <stdlib.h> （第 TBD 页）

- C11 标准（ISO/IEC 9899:2011）：

- 7.2 Diagnostics <assert.h> （第 186-187 页）

- 7.5 Errors <errno.h> （第 205 页）

- 7.19 Common definitions <stddef.h> （第 288 页）

- 7.20 Integer types <stdint.h> （第 289-295 页）

- 7.21 Input/output <stdio.h> （第 296-339 页）

- 7.22 General utilities <stdlib.h> （第 340-360 页）

- K.3.1.3 Use of errno （第 584 页）

- K.3.2/2 errno_t （第 585 页）

- K.3.3/2 rsize_t （第 585 页）

- K.3.4/2 RSIZE_MAX （第 585 页）

- 7.31.3 Errors <errno.h> （第 455 页）

- 7.31.10 Integer types <stdint.h> （第 456 页）

- 7.31.11 Input/output <stdio.h> （第 456 页）

- 7.31.12 General utilities <stdlib.h> （第 456 页）

- C99 标准（ISO/IEC 9899:1999）：

- 7.2 Diagnostics <assert.h> （第 169 页）

- 7.5 Errors <errno.h> （第 186 页）

- 7.26.3 Errors <errno.h> （第 401 页）

- 7.26.8 Integer types <stdint.h> （第 401 页）

- 7.26.9 Input/output <stdio.h> （第 402 页）

- 7.26.10 General utilities <stdlib.h> （第 402 页）

- C89/C90 标准（ISO/IEC 9899:1990）： 

- 4.2 DIAGNOSTICS <assert.h> 

- 4.1.3 Errors <errno.h> 

- 4.13.1 Errors <errno.h> 

- 4.13.6 Input/output <stdio.h> 

- 4.13.7 General utilities <stdlib.h> 

### 参阅

 math_errhandlingMATH_ERRNOMATH_ERREXCEPT(C99)(C99)(C99)

 定义用于常用数学函数的错误处理机制 
 (宏常量) 

 错误处理的 C++ 文档

 
 
 
 来自“https://zh.cppreference.com/mwiki/index.php?title=c/error&oldid=98175” 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 导航
 
- Online version
- Offline version retrieved 2025-04-04 09:58.
 
 
- 本页面最后修改于2025年2月3日 (星期一) 01:21。
 
 
 
 
 

	


