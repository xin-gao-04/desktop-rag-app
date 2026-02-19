

 

 
 

 add_compile_definitions 

 
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
 
- add_compile_definitions 
 
 

 
 
 
 
 
 

# add_compile_definitions¶

Added in version 3.12.

Add preprocessor definitions to the compilation of source files.

add_compile_definitions(<definition> ...)

Adds preprocessor definitions to the compiler command line.

The preprocessor definitions are added to the COMPILE_DEFINITIONS
directory property for the current CMakeLists file. They are also added to
the COMPILE_DEFINITIONS target property for each target in the
current CMakeLists file.

Definitions are specified using the syntax VAR or VAR=value.
Function-style definitions are not supported. CMake will automatically
escape the value correctly for the native build system (note that CMake
language syntax may require escapes to specify some values).

Added in version 3.26: Any leading -D on an item will be removed.

Arguments to add_compile_definitions may use generator expressions
with the syntax $<...>. See the cmake-generator-expressions(7)
manual for available expressions. See the cmake-buildsystem(7) manual
for more on defining buildsystem properties.

## See Also¶

- The command target_compile_definitions() adds target-specific definitions.

 
 
 
 
 
 
 
 
### Table of Contents

 

- add_compile_definitions
See Also

 
 
 Previous topic
 while

 
 
 Next topic
 add_compile_options

 
 
 
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
 
- add_compile_definitions 
 
 

 
 © Copyright 2000-2025 Kitware, Inc. and Contributors.
 Created using Sphinx 8.2.3.
 

 


