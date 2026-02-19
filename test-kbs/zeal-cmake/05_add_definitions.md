

 

 
 

 add_definitions 

 
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
 
- add_definitions 
 
 

 
 
 
 
 
 

# add_definitions¶

Add -D define flags to the compilation of source files.

add_definitions(-DFOO -DBAR ...)

Adds definitions to the compiler command line for targets in the current
directory, whether added before or after this command is invoked, and for
the ones in sub-directories added after. This command can be used to add any
flags, but it is intended to add preprocessor definitions.

Note

This command has been superseded by alternatives:

- Use add_compile_definitions() to add preprocessor definitions.

- Use include_directories() to add include directories.

- Use add_compile_options() to add other options.

Flags beginning in -D or /D that look like preprocessor definitions are
automatically added to the COMPILE_DEFINITIONS directory
property for the current directory. Definitions with non-trivial values
may be left in the set of flags instead of being converted for reasons of
backwards compatibility. See documentation of the
directory,
target,
source file COMPILE_DEFINITIONS
properties for details on adding preprocessor definitions to specific
scopes and configurations.

## See Also¶

- The cmake-buildsystem(7) manual for more on defining
buildsystem properties.

 
 
 
 
 
 
 
 
### Table of Contents

 

- add_definitions
See Also

 
 
 Previous topic
 add_custom_target

 
 
 Next topic
 add_dependencies

 
 
 
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
 
- add_definitions 
 
 

 
 © Copyright 2000-2025 Kitware, Inc. and Contributors.
 Created using Sphinx 8.2.3.
 

 


