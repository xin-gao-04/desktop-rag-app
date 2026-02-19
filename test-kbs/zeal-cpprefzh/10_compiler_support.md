

C 编译器支持

- 

 
 
 

 
 
 
 

 
# C 编译器支持

 
 
 
 
 来自cppreference.com
 
 
 < c
 
 
 

 
 我们尽可能努力维护这个页面，但仍可能缺少最新发布的编译器的版本信息。如果你发现有过时的内容的话，请帮助我们来更新它吧！ 

## C23 特性 

注意：随着 C23/2x 标准进程推进，这个页面可能过时。

### C23 核心语言特性

本节未完成
原因：Apple Clang 和其他编译器对 C2x 的支持状态 

C23 功能特性

 

提案

 

GCC

Clang

MSVC

Apple Clang

EDG eccp

Intel C++

Nvidia HPC C++ (ex PGI)*

Nvidia nvcc

Cray

无消息的 static_assert

N2265

9

9

是

是

6.5

2021.1.2 (基于 clang)

[[nodiscard]]

N2267

10

9

是

6.4

2021.1.2 (基于 clang)

[[maybe_unused]]

N2270

10

9

是

6.4

2021.1.2 (基于 clang)

[[deprecated]]

N2334

10

9

是

6.4

2021.1.2 (基于 clang)

属性

N2335
N2554

10

9

是

6.4

2021.1.2 (基于 clang)

IEEE 754 十进制浮点数类型

N2341

4.2 (部分)*
12

13.0 (部分)*

[[fallthrough]]

N2408

10

9

是

6.4

2021.1.2 (基于 clang)

u8 字符常量

N2418

10

15

6.5

2022.2

移除无原型的函数定义

N2432

10

15

2022.2

有消息的 [[nodiscard]]

N2448

11

10

是

6.4

2021.1.2 (基于 clang)

函数定义中的匿名形参

N2480

11

11

是

6.4

2021.1.2 (基于 clang)

声明和语句块结束前的标号

N2508

11

16

部分*

6.5

17.0*

二进制整数常量

N2549

4.3*
11

2.9*
9

19.0 (2015)**

是

6.5

11.0*

预处理条件中的 __has_c_attribute

N2553

11

9

是

6.5

2021.1.2 (基于 clang)

允许重复属性

N2557

11

13

是

6.5

2021.4 (基于 clang)

IEEE 754 交换和扩展类型

N2601

7 (部分)*
14

6 (部分)*

部分*

数位分隔符

N2626

12

13

19.0 (2015)**

是

6.5

18.0*

#elifdef 和 #elifndef

N2645

12

13

19.40*

13.1.6*

6.5

2021.4

u8 字符串字面量的类型修改

N2653

13

用于标号的 [[maybe_unused]]

N2662

11

16

6.5

2022.2

#warning

N2686

是

是

是

6.5

是

位精确整数类型 (_BitInt)

N2763

14 (部分)*

15

6.5

2022.2

[[noreturn]]

N2764

13

15

6.5

2022.2

位精确整数常量的后缀

N2775

14

15

2022.2

预处理条件中的 __has_include

N2799

5

是

19.11*

是

6.5

18.0

标识符语法，使用 Unicode 标准附件 31

N2836

13

15

6.5

2022.2

移除无原型的函数声明

N2841

13

15

2022.2

空初始化式

N2900

部分*
13

部分*

部分*

部分*

部分*

typeof 和 typeof_unqual

N2927
N2930

部分*
13

部分*
16

19.39*

部分*

部分*

部分*

部分*

新的关键词拼写

N2934

13

16

6.5

预定义 true 和 false

N2935

13

15

2022.2

[[unsequenced]] 和 [[reproducible]]

N2956

15

放宽对变长参数列表的要求

N2975

13

16

6.5

2023.1

对象定义中的类型推导

N3007

13

18

#embed

N3017

15

19

constexpr 对象

N3018

13

19

改善普通枚举

N3029

13

20*

有固定底层类型的枚举

N3030

13

20*

__VA_OPT__

N3033

8
13

12

19.39*

6.5

复合字面值的存储说明符

N3038

13

nullptr

N3042

13

16

 

C23 功能特性

 

提案

GCC

Clang

MSVC

Apple Clang

EDG eccp

Intel C++

Nvidia HPC C++ (ex PGI)*

Nvidia nvcc

Cray

### C23 库特性

本节未完成
原因：C 标准库的差异列表 

## C99 特性 

### C99 核心语言特性

本节未完成
原因：需要列出 C 编译器，并验证 

C99 功能特性

 

提案

 

GCC

Clang

MSVC

Apple Clang

EDG eccp

Intel C++

Nvidia HPC C++ (ex PGI)*

Nvidia nvcc

Cray

标识符中的通用字符名

3.1

是

是

提高翻译极限

N590

0.9

 不适用

// 注释

N644

2.7

是

是

restrict 指针

N448

2.95

是

部分*

增强算术类型

N815
N601
N620
N638
N657
N694
N809

是

部分

可能

灵活的数组成员

3.0

是

是

变长数组 (VLA) 类型

N683

0.9

是

可变修改 (VM) 类型

N2778

 不适用

是

定名初始化式

N494

3.0

是

是

非常量初始化式

1.21

 不适用

幂等 cvr 限定符

N505

3.0

 不适用

枚举项列表 中的尾部逗号

0.9

是

是

十六进制浮点数常量

N308

2.8

是

是

复合字面量

N716

3.1

是

是

浮点数环境

部分

部分

规定有符号整数类型的除法进行截断

N617

0.9

 不适用

main() 函数中的隐式 return 0;

是

是

是

混合安排声明和语句

N740

3.0

是

是

for 循环中的 初始化语句

是

是

是

inline 函数

N741

4.3

是

是

预定义变量 __func__

N611

2.95

是

是

函数声明中的 [] 之中的 cvr 限定符和 static

3.1

是

变参宏

N707

2.95

是

是

_Pragma 预处理器运算符

N634

3.0

是

部分*

浮点数求值的标准语用（pragma）

N631
N696

 否

 否

 

C99 功能特性

 

提案

GCC

Clang

MSVC

Apple Clang

EDG eccp

Intel C++

Nvidia HPC C++ (ex PGI)*

Nvidia nvcc

Cray

### 参阅 

 编译器支持的 C++ 文档

 
 
 
 来自“https://zh.cppreference.com/mwiki/index.php?title=c/compiler_support&oldid=98649” 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 导航
 Online version
- Offline version retrieved 2025-04-04 09:58.
 
 
- 本页面最后修改于2025年2月13日 (星期四) 22:52。
 
 
 
 
 

	


