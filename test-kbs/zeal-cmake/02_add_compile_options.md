

 

 
 

 add_compile_options 

 
- 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 

 
 
 

 
 
### Navigation

 
 
 index
 
- 
 next |
 
- 
 previous |
 
- 
 
 
 
- 
 
 CMake 4.2.2
 »
 
 
- 
 Documentation »
 

 
- cmake-commands(7) »
 
- add_compile_options 
 
 

 
 
 
 
 
 

# add_compile_options¶

Add options to the compilation of source files.

add_compile_options(<option> ...)

Adds options to the COMPILE_OPTIONS directory property.
These options are used when compiling targets from the current
directory and below.

Note

These options are not used when linking.
See the add_link_options() command for that.

## Arguments¶

Arguments to add_compile_options may use generator expressions
with the syntax $<...>. See the cmake-generator-expressions(7)
manual for available expressions. See the cmake-buildsystem(7) manual
for more on defining buildsystem properties.

## Option De-duplication¶

The final set of options used for a target is constructed by
accumulating options from the current target and the usage requirements of
its dependencies. The set of options is de-duplicated to avoid repetition.

Added in version 3.12: While beneficial for individual options, the de-duplication step can break
up option groups. For example, -option A -option B becomes
-option A B. One may specify a group of options using shell-like
quoting along with a SHELL: prefix. The SHELL: prefix is dropped,
and the rest of the option string is parsed using the
separate_arguments() UNIX_COMMAND mode. For example,
"SHELL:-option A" "SHELL:-option B" becomes -option A -option B.

## Example¶

Since different compilers support different options, a typical use of
this command is in a compiler-specific conditional clause:

if (MSVC)
 # warning level 4
 add_compile_options(/W4)
else()
 # additional warnings
 add_compile_options(-Wall -Wextra -Wpedantic)
endif()

To set per-language options, use the $<COMPILE_LANGUAGE>
or $<COMPILE_LANGUAGE:languages>
generator expressions.

## See Also¶

- This command can be used to add any options. However, for
adding preprocessor definitions and include directories it is recommended
to use the more specific commands add_compile_definitions()
and include_directories().

- The command target_compile_options() adds target-specific options.

- This command adds compile options for all languages.
Use the COMPILE_LANGUAGE generator expression to specify
per-language compile options.

- The source file property COMPILE_OPTIONS adds options to one
source file.

- add_link_options() adds options for linking.

- CMAKE_<LANG>_FLAGS and CMAKE_<LANG>_FLAGS_<CONFIG>
add language-wide flags passed to all invocations of the compiler.
This includes invocations that drive compiling and those that drive linking.

 
 
 
 
 
 
 
 
### Table of Contents

 

- add_compile_options
Arguments

- Option De-duplication

- Example

- See Also

 
 
 Previous topic
 add_compile_definitions

 
 
 Next topic
 add_custom_command

 
 
 
### This Page

 
 
- Show Source
 
 

 
### Quick search

 
 
 
 
 
 

 
 
 
 
 
 
### Navigation

 
 
- 
 index
 
- 
 next |
 
- 
 previous |
 
- 
 
 
 
- 
 
 CMake 4.2.2
 »
 
 
- 
 Documentation »
 

 
- cmake-commands(7) »
 
- add_compile_options 
 
 

 
 © Copyright 2000-2025 Kitware, Inc. and Contributors.
 Created using Sphinx 8.2.3.
 

 


