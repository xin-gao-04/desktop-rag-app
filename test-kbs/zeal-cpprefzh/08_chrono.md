

日期和时间工具

- 

 
 
 

 
 
 
 

 
# 日期和时间工具

 
 
 
 
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
 日期和时间工具
 函数
 时间操作
difftime
time
clock
timespec_get(C11)
timespec_getres(C23)
 格式转换
asctimeasctime_s(C23 弃用)(C11)
ctimectime_s(C23 弃用)(C11)
strftime
wcsftime(C95)
gmtimegmtime_rgmtime_s(C23)(C11)
localtimelocaltime_rlocaltime_s(C23)(C11)
mktime
 常量
CLOCKS_PER_SEC
 类型
tm
time_t
clock_t
timespec(C11)
 

### 函数

 时间操纵 

 在标头 <time.h> 定义 

 difftime

 计算时间差 
 (函数) 

 time

 返回纪元开始经过的当前系统日历时间 
 (函数) 

 clock

 返回未加工的程序启动时开始经过的处理器时间 
 (函数) 

 timespec_get(C11)

 返回基于给定时间基底的日历时间 
 (函数) 

 timespec_getres(C23)

 返回基于给定时间基底的日历时间的解析度 
 (函数) 

 格式转换 

 在标头 <time.h> 定义 

 asctimeasctime_s(C23 弃用)(C11)

 将 struct tm 对象转换成文本表示 
 (函数) 

 ctimectime_s(C23 弃用)(C11)

 将 struct time_t 对象转换成文本表示 
 (函数) 

 strftime

 将 struct tm 对象转换成自定义文本表示 
 (函数) 

 在标头 <wchar.h> 定义 

 wcsftime(C95)

 将 struct tm 对象转换成自定义宽字符文本表示 
 (函数) 

 在标头 <time.h> 定义 

 gmtimegmtime_rgmtime_s(C23)(C11)

 将从纪元开始的时间转换成以协调世界时（UTC）表示的日历时间 
 (函数) 

 localtimelocaltime_rlocaltime_s(C23)(C11)

 将从纪元开始的时间转换成以本地时间表示的日历时间 
 (函数) 

 mktime

 将日历时间转换成纪元开始经过的时间 
 (函数) 

### 常量

 在标头 <time.h> 定义 

 CLOCKS_PER_SEC

 处理器每秒时钟滴答数 
 (宏常量) 

### 类型

 在标头 <time.h> 定义 

 tm

 日历时间类型 
 (结构体) 

 time_t

 从纪元开始的日历时间类型 
 (typedef) 

 clock_t

 从时点开始的处理器时间类型 
 (typedef) 

 timespec(C11)

 单位为秒和纳秒的时间 
 (结构体) 

### 引用

 C23 标准（ISO/IEC 9899:2024）：

- 7.27 Date and time <time.h> （第 TBD 页）

- 7.29.5.1 The wcsftime function （第 TBD 页）

- 7.31.14 Date and time <time.h> （第 TBD 页）

- C17 标准（ISO/IEC 9899:2018）：

- 7.27 Date and time <time.h> （第 284-291 页）

- 7.29.5.1 The wcsftime function （第 320-321 页）

- 7.31.14 Date and time <time.h> （第 333 页）

- C11 标准（ISO/IEC 9899:2011）：

- 7.27 Date and time <time.h> （第 388-397 页）

- 7.29.5.1 The wcsftime function （第 439-440 页）

- 7.31.14 Date and time <time.h> （第 456 页）

- C99 标准（ISO/IEC 9899:1999）：

- 7.23 Date and time <time.h> （第 338-347 页）

- 7.24.5.1 The wcsftime function （第 385-386 页）

- C89/C90 标准（ISO/IEC 9899:1990）： 

- 4.12 DATE AND TIME <time.h> 

### 参阅

 C 日期和时间工具的 C++ 文档

 
 
 
 来自“https://zh.cppreference.com/mwiki/index.php?title=c/chrono&oldid=98966” 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 导航
 
- Online version
- Offline version retrieved 2025-04-04 09:58.
 
 
- 本页面最后修改于2025年2月15日 (星期六) 02:29。
 
 
 
 
 

	


