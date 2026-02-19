

 

 
 

 add_executable 

 
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
 
- add_executable 
 
 

 
 
 
 
 
 

# add_executable¶

Contents

- add_executable

Normal Executables

- Imported Executables

- Alias Executables

- See Also

Add an executable to the project using the specified source files.

## Normal Executables¶

add_executable(<name> <options>... <sources>...)¶
Add an executable target called <name> to
be built from the source files listed in the command invocation.

The options are:

WIN32Set the WIN32_EXECUTABLE target property automatically.
See documentation of that target property for details.

MACOSX_BUNDLESet the MACOSX_BUNDLE target property automatically.
See documentation of that target property for details.

EXCLUDE_FROM_ALLSet the EXCLUDE_FROM_ALL target property automatically.
See documentation of that target property for details.

The <name> corresponds to the logical target name and must be globally
unique within a project. The actual file name of the executable built is
constructed based on conventions of the native platform (such as
<name>.exe or just <name>).

Added in version 3.1: Source arguments to add_executable may use "generator expressions" with
the syntax $<...>. See the cmake-generator-expressions(7)
manual for available expressions.

Added in version 3.11: The source files can be omitted if they are added later using
target_sources().

By default the executable file will be created in the build tree
directory corresponding to the source tree directory in which the
command was invoked. See documentation of the
RUNTIME_OUTPUT_DIRECTORY target property to change this
location. See documentation of the OUTPUT_NAME target property
to change the <name> part of the final file name.

See the cmake-buildsystem(7) manual for more on defining
buildsystem properties.

See also HEADER_FILE_ONLY on what to do if some sources are
pre-processed, and you want to have the original sources reachable from
within IDE.

## Imported Executables¶

add_executable(<name> IMPORTED [GLOBAL])¶
Add an IMPORTED executable target to reference
an executable file located outside the project. The target name may be
referenced like any target built within the project, except that by
default it is visible only in the directory in which it is created,
and below.

The options are:

GLOBALMake the target name globally visible.

No rules are generated to build imported targets, and the IMPORTED
target property is True. Imported executables are useful for convenient
reference from commands like add_custom_command().

Details about the imported executable are specified by setting properties
whose names begin in IMPORTED_. The most important such property is
IMPORTED_LOCATION (and its per-configuration version
IMPORTED_LOCATION_<CONFIG>) which specifies the location of
the main executable file on disk. See documentation of the IMPORTED_*
properties for more information.

## Alias Executables¶

add_executable(<name> ALIAS <target>)¶
Creates an Alias Target, such that <name> can
be used to refer to <target> in subsequent commands. The <name>
does not appear in the generated buildsystem as a make target. The
<target> may not be an ALIAS.

Added in version 3.11: An ALIAS can target a GLOBAL Imported Target

Added in version 3.18: An ALIAS can target a non-GLOBAL Imported Target. Such alias is
scoped to the directory in which it is created and subdirectories.
The ALIAS_GLOBAL target property can be used to check if the
alias is global or not.

ALIAS targets can be used as targets to read properties
from, executables for custom commands and custom targets. They can also be
tested for existence with the regular if(TARGET) subcommand.
The <name> may not be used to modify properties of <target>, that
is, it may not be used as the operand of set_property(),
set_target_properties(), target_link_libraries() etc.
An ALIAS target may not be installed or exported.

## See Also¶

- add_library()

 
 
 
 
 
 
 
 
### Table of Contents

 

- add_executable
Normal Executables

- Imported Executables

- Alias Executables

- See Also

 
 
 Previous topic
 add_dependencies

 
 
 Next topic
 add_library

 
 
 
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
 
- add_executable 
 
 

 
 © Copyright 2000-2025 Kitware, Inc. and Contributors.
 Created using Sphinx 8.2.3.
 

 


