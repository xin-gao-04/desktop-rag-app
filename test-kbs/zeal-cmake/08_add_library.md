

 

 
 

 add_library 

 
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
 
- add_library 
 
 

 
 
 
 
 
 

# add_library¶

Contents

- add_library

Normal Libraries

- Object Libraries

- Interface Libraries

- Imported Libraries

- Alias Libraries

- See Also

Add a library to the project using the specified source files.

## Normal Libraries¶

add_library(<name> [<type>] [EXCLUDE_FROM_ALL] <sources>...)¶
Add a library target called <name> to be built from the source files
listed in the command invocation.

The optional <type> specifies the type of library to be created:

STATICA Static Library:
an archive of object files for use when linking other targets.

SHAREDA Shared Library:
a dynamic library that may be linked by other targets and loaded
at runtime.

MODULEA Module Library:
a plugin that may not be linked by other targets, but may be
dynamically loaded at runtime using dlopen-like functionality.

If no <type> is given the default is STATIC or SHARED
based on the value of the BUILD_SHARED_LIBS variable.

The options are:

EXCLUDE_FROM_ALLSet the EXCLUDE_FROM_ALL target property automatically.
See documentation of that target property for details.

The <name> corresponds to the logical target name and must be globally
unique within a project. The actual file name of the library built is
constructed based on conventions of the native platform (such as
lib<name>.a or <name>.lib).

Added in version 3.1: Source arguments to add_library may use "generator expressions" with
the syntax $<...>. See the cmake-generator-expressions(7)
manual for available expressions.

Added in version 3.11: The source files can be omitted if they are added later using
target_sources().

For SHARED and MODULE libraries the
POSITION_INDEPENDENT_CODE target
property is set to ON automatically.
A SHARED library may be marked with the FRAMEWORK
target property to create an macOS Framework.

Added in version 3.8: A STATIC library may be marked with the FRAMEWORK
target property to create a static Framework.

If a library does not export any symbols, it must not be declared as a
SHARED library. For example, a Windows resource DLL or a managed C++/CLI
DLL that exports no unmanaged symbols would need to be a MODULE library.
This is because CMake expects a SHARED library to always have an
associated import library on Windows.

By default the library file will be created in the build tree directory
corresponding to the source tree directory in which the command was
invoked. See documentation of the ARCHIVE_OUTPUT_DIRECTORY,
LIBRARY_OUTPUT_DIRECTORY, and
RUNTIME_OUTPUT_DIRECTORY target properties to change this
location. See documentation of the OUTPUT_NAME target
property to change the <name> part of the final file name.

See the cmake-buildsystem(7) manual for more on defining
buildsystem properties.

See also HEADER_FILE_ONLY on what to do if some sources are
pre-processed, and you want to have the original sources reachable from
within IDE.

Changed in version 3.30: On platforms that do not support shared libraries, add_library
now fails on calls creating SHARED libraries instead of
automatically converting them to STATIC libraries as before.
See policy CMP0164.

## Object Libraries¶

add_library(<name> OBJECT <sources>...)¶
Add an Object Library to compile source files
without archiving or linking their object files into a library.

Other targets created by add_library or add_executable()
may reference the objects using an expression of the
form $<TARGET_OBJECTS:objlib> as a source, where
objlib is the object library name. For example:

add_library(... $<TARGET_OBJECTS:objlib> ...)
add_executable(... $<TARGET_OBJECTS:objlib> ...)

will include objlib's object files in a library and an executable
along with those compiled from their own sources. Object libraries
may contain only sources that compile, header files, and other files
that would not affect linking of a normal library (e.g. .txt).
They may contain custom commands generating such sources, but not
PRE_BUILD, PRE_LINK, or POST_BUILD commands. Some native build
systems (such as Xcode) may not like targets that have only
object files, so consider adding at least one real source file to any target
that references $<TARGET_OBJECTS:objlib>.

Added in version 3.12: Object libraries can be linked to with target_link_libraries().

## Interface Libraries¶

add_library(<name> INTERFACE)¶
Add an Interface Library target that may
specify usage requirements for dependents but does not compile sources
and does not produce a library artifact on disk.

An interface library with no source files is not included as a target
in the generated buildsystem. However, it may have
properties set on it and it may be installed and exported.
Typically, INTERFACE_* properties are populated on an interface
target using the commands:

- set_property(),

- target_link_libraries(INTERFACE),

- target_link_options(INTERFACE),

- target_include_directories(INTERFACE),

- target_compile_options(INTERFACE),

- target_compile_definitions(INTERFACE), and

- target_sources(INTERFACE),

and then it is used as an argument to target_link_libraries()
like any other target.

Added in version 3.15: An interface library can have PUBLIC_HEADER and
PRIVATE_HEADER properties. The headers specified by those
properties can be installed using the install(TARGETS) command.

add_library(<name> INTERFACE [EXCLUDE_FROM_ALL] <sources>...)¶

Added in version 3.19.

Add an Interface Library target with
source files (in addition to usage requirements and properties as
documented by the above signature).
Source files may be listed directly in the add_library call
or added later by calls to target_sources() with the
PRIVATE or PUBLIC keywords.

If an interface library has source files (i.e. the SOURCES
target property is set), or header sets (i.e. the HEADER_SETS
target property is set), it will appear in the generated buildsystem
as a build target much like a target defined by the
add_custom_target() command. It does not compile any sources,
but does contain build rules for custom commands created by the
add_custom_command() command.

The options are:

EXCLUDE_FROM_ALLSet the EXCLUDE_FROM_ALL target property automatically.
See documentation of that target property for details.

Note

In most command signatures where the INTERFACE keyword appears,
the items listed after it only become part of that target's usage
requirements and are not part of the target's own settings. However,
in this signature of add_library, the INTERFACE keyword refers
to the library type only. Sources listed after it in the add_library
call are PRIVATE to the interface library and do not appear in its
INTERFACE_SOURCES target property.

add_library(<name> INTERFACE SYMBOLIC)¶

Added in version 4.2.

Add a symbolic Interface Library target.
Symbolic interface libraries are useful for representing optional components
or features in a package. They have no usage requirements, do not compile
sources, and do not produce a library artifact on disk, but they may be
exported and installed. They can also be tested for existence with the
regular if(TARGET) subcommand.

A symbolic interface library may be used as a linkable target to enforce the
presence of optional components in a dependency. For example, if a library
libgui may or may not provide a feature widget, a consumer package
can link against widget to express that it requires this component to be
available. This allows find_package() calls that declare required
components to be validated by linking against the corresponding symbolic
targets.

A symbolic interface library has the SYMBOLIC target property
set to true.

## Imported Libraries¶

add_library(<name> <type> IMPORTED [GLOBAL])¶
Add an IMPORTED library target called <name>.
The target name may be referenced like any target built within the project,
except that by default it is visible only in the directory in which it is
created, and below.

The <type> must be one of:

STATIC, SHARED, MODULE, UNKNOWNReferences a library file located outside the project. The
IMPORTED_LOCATION target property (or its per-configuration
variant IMPORTED_LOCATION_<CONFIG>) specifies the
location of the main library file on disk:

- For a SHARED library on most non-Windows platforms, the main library
file is the .so or .dylib file used by both linkers and dynamic
loaders. If the referenced library file has a SONAME (or on macOS,
has a LC_ID_DYLIB starting in @rpath/), the value of that field
should be set in the IMPORTED_SONAME target property.
If the referenced library file does not have a SONAME, but the
platform supports it, then the IMPORTED_NO_SONAME target
property should be set.

- For a SHARED library on Windows, the IMPORTED_IMPLIB
target property (or its per-configuration variant
IMPORTED_IMPLIB_<CONFIG>) specifies the location of the
DLL import library file (.lib or .dll.a) on disk, and the
IMPORTED_LOCATION is the location of the .dll runtime
library (and is optional, but needed by the TARGET_RUNTIME_DLLS
generator expression).

Additional usage requirements may be specified in INTERFACE_*
properties.

An UNKNOWN library type is typically only used in the implementation
of Find Modules. It allows the path to an imported library
(often found using the find_library() command) to be used
without having to know what type of library it is. This is especially
useful on Windows where a static library and a DLL's import library
both have the same file extension.

OBJECTReferences a set of object files located outside the project.
The IMPORTED_OBJECTS target property (or its per-configuration
variant IMPORTED_OBJECTS_<CONFIG>) specifies the locations of
object files on disk.
Additional usage requirements may be specified in INTERFACE_*
properties.

INTERFACEDoes not reference any library or object files on disk, but may
specify usage requirements in INTERFACE_* properties.

The options are:

GLOBALMake the target name globally visible.

No rules are generated to build imported targets, and the IMPORTED
target property is True. Imported libraries are useful for convenient
reference from commands like target_link_libraries().

Details about the imported library are specified by setting properties whose
names begin in IMPORTED_ and INTERFACE_. See documentation of
such properties for more information.

## Alias Libraries¶

add_library(<name> ALIAS <target>)¶
Creates an Alias Target, such that <name> can be
used to refer to <target> in subsequent commands. The <name> does
not appear in the generated buildsystem as a make target. The <target>
may not be an ALIAS.

Added in version 3.11: An ALIAS can target a GLOBAL Imported Target

Added in version 3.18: An ALIAS can target a non-GLOBAL Imported Target. Such alias is
scoped to the directory in which it is created and below.
The ALIAS_GLOBAL target property can be used to check if the
alias is global or not.

ALIAS targets can be used as linkable targets and as targets to
read properties from. They can also be tested for existence with the
regular if(TARGET) subcommand. The <name> may not be used
to modify properties of <target>, that is, it may not be used as the
operand of set_property(), set_target_properties(),
target_link_libraries() etc. An ALIAS target may not be
installed or exported.

## See Also¶

- add_executable()

 
 
 
 
 
 
 
 
### Table of Contents

 

- add_library
Normal Libraries

- Object Libraries

- Interface Libraries

- Imported Libraries

- Alias Libraries

- See Also

 
 
 Previous topic
 add_executable

 
 
 Next topic
 add_link_options

 
 
 
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
 
- add_library 
 
 

 
 © Copyright 2000-2025 Kitware, Inc. and Contributors.
 Created using Sphinx 8.2.3.
 

 


