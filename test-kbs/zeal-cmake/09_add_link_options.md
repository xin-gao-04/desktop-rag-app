

 

 
 

 add_link_options 

 
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
 
- add_link_options 
 
 

 
 
 
 
 
 

# add_link_options¶

Added in version 3.13.

Add options to the link step for executable, shared library or module
library targets in the current directory and below that are added after
this command is invoked.

add_link_options(<option> ...)

This command can be used to add any link options, but alternative commands
exist to add libraries (target_link_libraries() or
link_libraries()). See documentation of the
directory and
target LINK_OPTIONS properties.

Note

This command cannot be used to add options for static library targets,
since they do not use a linker. To add archiver or MSVC librarian flags,
see the STATIC_LIBRARY_OPTIONS target property.

Arguments to add_link_options may use generator expressions
with the syntax $<...>. See the cmake-generator-expressions(7)
manual for available expressions. See the cmake-buildsystem(7) manual
for more on defining buildsystem properties.

## Host And Device Specific Link Options¶

Added in version 3.18: When a device link step is involved, which is controlled by
CUDA_SEPARABLE_COMPILATION and
CUDA_RESOLVE_DEVICE_SYMBOLS properties and policy CMP0105,
the raw options will be delivered to the host and device link steps (wrapped in
-Xcompiler or equivalent for device link). Options wrapped with
$<DEVICE_LINK:...> generator expression will be used
only for the device link step. Options wrapped with $<HOST_LINK:...>
generator expression will be used only for the host link step.

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

## Handling Compiler Driver Differences¶

To pass options to the linker tool, each compiler driver has its own syntax.
The LINKER: prefix and , separator can be used to specify, in a portable
way, options to pass to the linker tool. LINKER: is replaced by the
appropriate driver option and , by the appropriate driver separator.
The driver prefix and driver separator are given by the values of the
CMAKE_<LANG>_LINKER_WRAPPER_FLAG and
CMAKE_<LANG>_LINKER_WRAPPER_FLAG_SEP variables.

For example, "LINKER:-z,defs" becomes -Xlinker -z -Xlinker defs for
Clang and -Wl,-z,defs for GNU GCC.

The LINKER: prefix can be specified as part of a SHELL: prefix
expression.

The LINKER: prefix supports, as an alternative syntax, specification of
arguments using the SHELL: prefix and space as separator. The previous
example then becomes "LINKER:SHELL:-z defs".

Note

Specifying the SHELL: prefix anywhere other than at the beginning of the
LINKER: prefix is not supported.

## See Also¶

- link_libraries()

- target_link_libraries()

- target_link_options()

- CMAKE_<LANG>_FLAGS and CMAKE_<LANG>_FLAGS_<CONFIG>
add language-wide flags passed to all invocations of the compiler.
This includes invocations that drive compiling and those that drive linking.

 
 
 
 
 
 
 
 
### Table of Contents

 

- add_link_options
Host And Device Specific Link Options

- Option De-duplication

- Handling Compiler Driver Differences

- See Also

 
 
 Previous topic
 add_library

 
 
 Next topic
 add_subdirectory

 
 
 
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
 
- add_link_options 
 
 

 
 © Copyright 2000-2025 Kitware, Inc. and Contributors.
 Created using Sphinx 8.2.3.
 

 


