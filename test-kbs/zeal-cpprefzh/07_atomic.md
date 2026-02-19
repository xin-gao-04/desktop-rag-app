

原子操作库

- 

 
 
 

 
 
 
 

 
# 原子操作库

 
 
 
 
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
 原子操作库
 类型
memory_order
atomic_flag
 宏
ATOMIC_***_LOCK_FREE
ATOMIC_FLAG_INIT
ATOMIC_VAR_INIT
kill_dependency
 函数
atomic_flag_test_and_set
atomic_flag_clear
atomic_init
atomic_is_lock_free
atomic_store
atomic_load
atomic_exchange
atomic_compare_exchange
atomic_fetch_add
atomic_fetch_sub
atomic_fetch_or
atomic_fetch_xor
atomic_fetch_and
atomic_thread_fence
atomic_signal_fence
 
若编译器定义宏常量 __STDC_NO_ATOMICS__(C11) ，则不提供头文件 <stdatomic.h> 、关键词 _Atomic 以及所有列于此的名称。

### 类型

 在标头 <stdatomic.h> 定义 

 memory_order(C11)

 定义内存顺序制约 
 (枚举) 

 atomic_flag(C11)

 免锁原子布尔标志 
 (结构体) 

### 宏

 在标头 <stdatomic.h> 定义 

 ATOMIC_BOOL_LOCK_FREEATOMIC_CHAR_LOCK_FREEATOMIC_CHAR16_T_LOCK_FREEATOMIC_CHAR32_T_LOCK_FREEATOMIC_WCHAR_T_LOCK_FREEATOMIC_SHORT_LOCK_FREEATOMIC_INT_LOCK_FREEATOMIC_LONG_LOCK_FREEATOMIC_LLONG_LOCK_FREEATOMIC_POINTER_LOCK_FREE(C11)

 指示给定的原子类型为免锁 
 (宏常量) 

 ATOMIC_FLAG_INIT(C11)

 初始化新的 atomic_flag 
 (宏常量) 

 ATOMIC_VAR_INIT(C11)(C17 弃用)(C23 移除)

 初始化新的原子对象 
 (宏函数) 

 kill_dependency(C11)

 打破 memory_order_consume 的依赖链 
 (宏函数) 

### 函数

 在标头 <stdatomic.h> 定义 

 atomic_flag_test_and_setatomic_flag_test_and_set_explicit(C11)

 设置 atomic_flag 为 true 并返回旧值 
 (函数) 

 atomic_flag_clearatomic_flag_clear_explicit(C11)

 设置 atomic_flag 为 false 
 (函数) 

 atomic_init(C11)

 初始化既存的原子对象 
 (函数) 

 atomic_is_lock_free(C11)

 指示原子对象是否免锁 
 (函数) 

 atomic_storeatomic_store_explicit(C11)

 存储值到原子对象 
 (函数) 

 atomic_loadatomic_load_explicit(C11)

 从原子对象读取值 
 (函数) 

 atomic_exchangeatomic_exchange_explicit(C11)

 将原子对象的值与一个值交换 
 (函数) 

 atomic_compare_exchange_strongatomic_compare_exchange_strong_explicitatomic_compare_exchange_weakatomic_compare_exchange_weak_explicit(C11)

 若原子对象的旧值为所期待的值则将之与一个值交换，否则读取该旧值 
 (函数) 

 atomic_fetch_addatomic_fetch_add_explicit(C11)

 原子加法 
 (函数) 

 atomic_fetch_subatomic_fetch_sub_explicit(C11)

 原子减法 
 (函数) 

 atomic_fetch_oratomic_fetch_or_explicit(C11)

 原子逐位或（OR） 
 (函数) 

 atomic_fetch_xoratomic_fetch_xor_explicit(C11)

 原子逐位异或（XOR） 
 (函数) 

 atomic_fetch_andatomic_fetch_and_explicit(C11)

 原子逐位与（AND） 
 (函数) 

 atomic_thread_fence(C11)

 通用的内存顺序依赖的栅栏同步原语 
 (函数) 

 atomic_signal_fence(C11)

 线程与执行于同一线程的信号处理函数间的栅栏 
 (函数) 

### 类型

标准库为核心语言原子类型提供便利 typedef 。

 typedef 名

 完整类型名

 atomic_bool

 _Atomic _Bool

 atomic_char

 _Atomic char

 atomic_schar

 _Atomic signed char

 atomic_uchar

 _Atomic unsigned char

 atomic_short

 _Atomic short

 atomic_ushort

 _Atomic unsigned short

 atomic_int

 _Atomic int

 atomic_uint

 _Atomic unsigned int

 atomic_long

 _Atomic long

 atomic_ulong

 _Atomic unsigned long

 atomic_llong

 _Atomic long long

 atomic_ullong

 _Atomic unsigned long long

 atomic_char8_t (C23)

 _Atomic char8_t

 atomic_char16_t

 _Atomic char16_t

 atomic_char32_t

 _Atomic char32_t

 atomic_wchar_t

 _Atomic wchar_t

 atomic_int_least8_t

 _Atomic int_least8_t

 atomic_uint_least8_t

 _Atomic uint_least8_t

 atomic_int_least16_t

 _Atomic int_least16_t

 atomic_uint_least16_t

 _Atomic uint_least16_t

 atomic_int_least32_t

 _Atomic int_least32_t

 atomic_uint_least32_t

 _Atomic uint_least32_t

 atomic_int_least64_t

 _Atomic int_least64_t

 atomic_uint_least64_t

 _Atomic uint_least64_t

 atomic_int_fast8_t

 _Atomic int_fast8_t

 atomic_uint_fast8_t

 _Atomic uint_fast8_t

 atomic_int_fast16_t

 _Atomic int_fast16_t

 atomic_uint_fast16_t

 _Atomic uint_fast16_t

 atomic_int_fast32_t

 _Atomic int_fast32_t

 atomic_uint_fast32_t

 _Atomic uint_fast32_t

 atomic_int_fast64_t

 _Atomic int_fast64_t

 atomic_uint_fast64_t

 _Atomic uint_fast64_t

 atomic_intptr_t

 _Atomic intptr_t

 atomic_uintptr_t

 _Atomic uintptr_t

 atomic_size_t

 _Atomic size_t

 atomic_ptrdiff_t

 _Atomic ptrdiff_t

 atomic_intmax_t

 _Atomic intmax_t

 atomic_uintmax_t

 _Atomic uintmax_t

### 引用

 C23 标准（ISO/IEC 9899:2024）：

- 7.17 Atomics <stdatomic.h> （第 TBD 页）

- 7.31.8 Atomics <stdatomic.h> （第 TBD 页）

- C17 标准（ISO/IEC 9899:2018）：

- 7.17 Atomics <stdatomic.h> （第 TBD 页）

- 7.31.8 Atomics <stdatomic.h> （第 TBD 页）

- C11 标准（ISO/IEC 9899:2011）：

- 7.17 Atomics <stdatomic.h> （第 273-286 页）

- 7.31.8 Atomics <stdatomic.h> （第 455-456 页）

### 参阅

 原子操作库的 C++ 文档

 
 
 
 来自“https://zh.cppreference.com/mwiki/index.php?title=c/atomic&oldid=80325” 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 导航
 
- Online version
- Offline version retrieved 2025-04-04 09:58.
 
 
- 本页面最后修改于2023年10月31日 (星期二) 09:37。
 
 
 
 
 

	


