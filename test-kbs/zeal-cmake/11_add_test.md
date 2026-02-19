

 

 
 

 add_test 

 
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
 
- add_test 
 
 

 
 
 
 
 
 

# add_test¶

Add a test to the project to be run by ctest(1).

add_test(NAME <name> COMMAND <command> [<arg>...]
 [CONFIGURATIONS <config>...]
 [WORKING_DIRECTORY <dir>]
 [COMMAND_EXPAND_LISTS])

Adds a test called <name>. The test name may contain arbitrary
characters, expressed as a Quoted Argument or Bracket Argument
if necessary. See policy CMP0110.

CMake only generates tests if the enable_testing() command has been
invoked. The CTest module invokes enable_testing automatically
unless BUILD_TESTING is set to OFF.

Tests added with the add_test(NAME) signature support using
generator expressions
in test properties set by set_property(TEST) or
set_tests_properties(). Test properties may only be set in the
directory the test is created in.

add_test options are:

COMMANDSpecify the test command-line.

If <command> specifies an executable target created by
add_executable():

- It will automatically be replaced by the location of the executable
created at build time.

- 
Added in version 3.3: The target's CROSSCOMPILING_EMULATOR, if set, will be
used to run the command on the host:

<emulator> <command>

Changed in version 3.29: The emulator is used only when
cross-compiling.
See policy CMP0158.

- 
Added in version 3.29: The target's TEST_LAUNCHER, if set, will be
used to launch the command:

<launcher> <command>

If the CROSSCOMPILING_EMULATOR is also set, both are used:

<launcher> <emulator> <command>

The command may be specified using
generator expressions.

CONFIGURATIONSRestrict execution of the test only to the named configurations.

WORKING_DIRECTORYSet the test property WORKING_DIRECTORY in which to execute the
test. If not specified, the test will be run in
CMAKE_CURRENT_BINARY_DIR. The working directory may be specified
using generator expressions.

COMMAND_EXPAND_LISTS
Added in version 3.16.

Lists in COMMAND arguments will be expanded, including those created with
generator expressions.

If the test command exits with code 0 the test passes. Non-zero exit code
is a "failed" test. The test property WILL_FAIL inverts this
logic. Note that system-level test failures such as segmentation faults or
heap errors will still fail the test even if WILL_FAIL is true. Output
written to stdout or stderr is captured by ctest(1) and only
affects the pass/fail status via the PASS_REGULAR_EXPRESSION,
FAIL_REGULAR_EXPRESSION, or SKIP_REGULAR_EXPRESSION
test properties.

Added in version 3.16: Added SKIP_REGULAR_EXPRESSION property.

Example usage:

add_test(NAME mytest
 COMMAND testDriver --config $<CONFIG>
 --exe $<TARGET_FILE:myexe>)

This creates a test mytest whose command runs a testDriver tool
passing the configuration name and the full path to the executable
file produced by target myexe.

The command syntax above is recommended over the older, less flexible form:

add_test(<name> <command> [<arg>...])

Add a test called <name> with the given command-line.

Unlike the above NAME signature, target names are not supported
in the command-line. Furthermore, tests added with this signature do not
support generator expressions
in the command-line or test properties, and the TEST_LAUNCHER
and CROSSCOMPILING_EMULATOR target properties are not supported.

 
 
 
 
 
 
 
 Previous topic
 add_subdirectory

 
 
 Next topic
 aux_source_directory

 
 
 
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
 
- add_test 
 
 

 
 © Copyright 2000-2025 Kitware, Inc. and Contributors.
 Created using Sphinx 8.2.3.
 

 


