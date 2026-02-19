
 

 
 
 Miscellaneous | QDoc Manual 5.15.18

- 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 

 

 
 
 Back to Qt.io
 
 
 Contact Us
 Blog
 Download Qt
 
 

 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
- 
 Archives
 
 
- 
 Snapshots
 
 
 
 
 
 
 
 

 
 
 
 
 
 
 
 
 
 
 
 
 
- 
 
 Reference
 
 
 
 
 All Qt C++ Classes
 
 
 
- 
 
 All QML Types
 
 
 
- 
 
 All Qt Modules
 
 
 
- 
 
 Qt Creator Manual
 
 
 
- 
 
 All Qt Reference Documentation
 
 
 

 
- 
 
 Getting Started
 
 
 
 
 Getting Started with Qt
 
 
 
- 
 
 What's New in Qt 5
 
 
 
- 
 
 Examples and Tutorials
 
 
 
- 
 
 Supported Platforms
 
 
 
- 
 
 Qt Licensing
 
 
 

 
- 
 
 Overviews
 
 
 
 
 Development Tools
 
 
 
- 
 
 User Interfaces
 
 
 
- 
 
 Core Internals
 
 
 
- 
 
 Data Storage
 
 
 
- 
 
 Multimedia
 
 
 
- 
 
 Networking and Connectivity
 
 
 
- 
 
 Graphics
 
 
 
- 
 
 Mobile APIs
 
 
 
- 
 
 QML Applications
 
 
 
- 
 
 All Qt Overviews
 
 
 

 
 
 
 
 
 
 
 
 
 
 Search
 
 
 
 
 
- Qt 5.15
 
- QDoc Manual
 
- Miscellaneous
 
 
 
 
 
 
 
 

- 

Special Content
The QDoc Configuration File

# Miscellaneous

 
These commands provide miscellaneous functions connected to the visual appearance of the documentation, and to the process of generating the documentation.

## \annotatedlist

The \annotatedlist command expands to a list of the members of a group, each member listed with its brief text. Below is an example from the Qt Reference Documentation:

/ *!
 ...
 \section1 Drag and Drop Classes

 These classes deal with drag and drop and the necessary mime type
 encoding and decoding.

 \annotatedlist draganddrop

* /
This generates a list of all the C++ classes and/or QML types in the draganddrop group. A C++ class or QML type in the draganddrop group will have \ingroup draganddrop in its \class or \qmltype comment.

## \generatelist

The \generatelist command expands to a list of links to the documentation entities in a group. Below is an example from the Qt Reference Documentation:

/ *!
 \page classes.html
 \title All Classes

 For a shorter list that only includes the most
 frequently used classes, see \l{Qt's Main Classes}.

 \generatelist classes Q
* /

This generates the All Classes page. The command accepts the following arguments:

### annotatedclasses

The annotatedclasses argument provides a table containing the names of all the classes, and a description of each class. Each class name is a link to the class's reference documentation. For example:

QDialRounded range control (like a speedometer or potentiometer)
QDialogThe base class of dialog windows
QDirAccess to directory structures and their contents

A C++ class is documented with the \class command. The annotation for the class is taken from the argument of the class comment's \brief command.

### annotatedexamples

The annotatedexamples argument provides a complete list of all examples as a set of tables containing the titles of all the examples, and a description of each example. Each title is a link to the example's documentation.

A separate table for each module (that has documented examples) is generated, provided that the module has defined a navigation.landingpage configuration variable. The landingpage variable is used as a title for a header that precedes each table.

### annotatedattributions

The annotatedattributions argument provides a complete list of all attributions as a set of tables containing the titles of all the attributions, and a description of each attribution. Each title is a link to the attribution's page.

A separate table for each module (that has attributions) is generated, provided that the module has defined a navigation.landingpage configuration variable. The landingpage variable is used as a title for a header that precedes each table.

### classes <prefix>

The classes argument provides a complete alphabetical list of the classes. The second argument, <prefix>, is the common prefix for the class names. The class names will be sorted on the character that follows the common prefix. e.g. The common prefix for the Qt classes is Q. The common prefix argument is optional. If no common prefix is provided, the class names will be sorted on their first character.

Each class name becomes a link to the class's reference documentation. This command is used to generate the All Classes page this way:

/ *!
 \page classes.html
 \title All Classes
 \ingroup classlists

 \brief Alphabetical list of classes.

 This is a list of all Qt classes. For classes that
 have been deprecated, see the \l{Obsolete Classes}
 list.

 \generatelist classes Q
* /
A C++ class is documented with the \class command.

### classesbymodule

When this argument is used, a second argument is required, which specifies the module whose classes are to be listed. QDoc generates a table containing those classes. Each class is listed with the text of its \brief command.

For example, this command can be used on a module page as follows:

/ *!
 \page phonon-module.html
 \module Phonon
 \title Phonon Module
 \ingroup modules

 \brief Contains namespaces and classes for multimedia functionality.

 \generatelist{classesbymodule Phonon}

...

* /
Each class that is a member of the specified module must be marked with the \inmodule command in its \class comment.

### qmltypesbymodule

Similar to classesbymodule argument, but used for listing the QML types from the QML module specified with the second argument.

Note: Support for this argument was introduced in QDoc 5.6.

### jstypesbymodule

Similar to classesbymodule argument, but used for listing the JavaScript types from the module specified with the second argument.

Note: Support for this argument was introduced in QDoc 5.6.

### examplefiles [regular_expression]

The examplefiles argument lists the files that are part of an example project. The optional second argument is a regular expression; if provided, only the files whose path matches with the regular expression are listed.

The examplefiles argument can be only used within example documentation (see \example), and is typically used together with the \noautolist command.

### exampleimages [regular_expression]

The exampleimages argument lists the images that are part of an example project. The optional second argument is a regular expression; if provided, only the image files whose path matches with the regular expression are listed.

The exampleimages argument can be only used within example documentation (see \example), and is typically used together with the \noautolist command.

### functionindex

The functionindex argument provides a complete alphabetical list of all the documented member functions. It is normally used only to generate the Qt function index page this way:

/ *!
 \page functions.html
 \title All Functions
 \ingroup funclists

 \brief All documented Qt functions listed alphabetically with a
 link to where each one is declared.

 This is the list of all documented member functions and global
 functions in the Qt API. Each function has a link to the
 class or header file where it is declared and documented.

 \generatelist functionindex
* /

### legalese

The legalese argument tells QDoc to generate a list of licenses in the current documentation project. Each license is identified using the \legalese command.

### overviews

The overviews argument is used to tell QDoc to generate a list by concatenating the contents of all the \group pages. Qt uses it to generate the overviews page this way:

/ *!
 \page overviews.html

 \title All Overviews and HOWTOs

 \generatelist overviews
* /

### attributions

The attributions argument is used to tell QDoc to generate a list of attributions in the documentation.

### related

The related argument is used in combination with the \group and \ingroup commands to list all the overviews related to a specified group. For example, the page for the Programming with Qt page is generated this way:

/ *!
 \group qt-basic-concepts
 \title Programming with Qt

 \brief The basic architecture of the Qt cross-platform application and UI framework.

 Qt is a cross-platform application and UI framework for
 writing web-enabled applications for desktop, mobile, and
 embedded operating systems. This page contains links to
 articles and overviews explaining key components and
 techniuqes used in Qt development.

 \generatelist {related}
* /
Each page listed on this group page contains the command:

\ingroup qt-basic-concepts

## \if

The \if command and the corresponding \endif command enclose parts of a QDoc comment that only will be included if the condition specified by the command's argument is true.

The command reads the rest of the line and parses it as an C++ #if statement.

/ *!
 \if defined(opensourceedition)

 \note This edition is for the development of
 \l{Qt Open Source Edition} {Free and Open Source}
 software only; see \l{Qt Commercial Editions}.

 \endif
* /
This QDoc comment will only be rendered if the opensourceedition preprocessor symbol is defined, and specified in the defines variable in the configuration file to make QDoc process the code within #ifdef and #endif:

defines = opensourceedition
You can also define the preprocessor symbol manually on the command line. For more information see the documentation of the defines variable.

See also \endif, \else, defines and falsehoods.

## \endif

The \endif command and the corresponding \if command enclose parts of a QDoc comment that will be included if the condition specified by the \if command's argument is true.

For more information, see the documentation of the \if command.

See also \if, \else, defines and falsehoods.

## \else

The \else command specifies an alternative if the condition in the \if command is false.

The \else command can only be used within \if...\endif commands, but is useful when there is only two alternatives.

## \include

The \include command sends all or part of the file specified by its first argument to the QDoc input stream to be processed as a QDoc comment snippet.

The command is useful when some snippet of commands or text is to be used in multiple places in the documentation. Use the \include command wherever you want to insert a snippet into the documentation. The file containing the snippet to include, must be located under the path(s) listed in the sourcedirs or exampledirs QDoc configuration variable. It can be either any source file parsed by QDoc (or even the same one where \include command is used), or any other text file. To store snippets in a separate file that is not meant to be parsed by QDoc, use a file extension that is not listed in sources.fileextensions; for example, .qdocinc.

The command can have either one or two arguments. The first argument is always a file name. The contents of the file must be QDoc input, in other words, a sequence of QDoc commands and text, but without the enclosing QDoc comment /*! ... */ delimiters. If you want to include the entire named file, don't use the second argument. If you want to include only part of the file, see the two argument form below. Here is an example of the one argument form:

/ *!
 \page corefeatures.html
 \title Core Features

 \include examples/signalandslots.qdocinc
 \include examples/objectmodel.qdocinc
 \include examples/layoutmanagement.qdocinc
* /
QDoc renders this page as shown here.

### \include filename snippet-identifier

It is a waste of time to make a separate .qdocinc file for every QDoc include snippet you want to use in multiple places in the documentation, especially given that you probably have to put the copyright/license notice in every one of these files. So if you have a large number of snippets to be included, you can put them all in a single file if you want, and surround each one with:

 //! [snippet-id1]

 QDoc commands and text...

//! [snippet-id1]

 //! [snippet-id2]

 More QDoc commands and text...

//! [snippet-id2]
Then you can use the two-argument form of the command:

\input examples/signalandslots.qdocinc snippet-id2
\input examples/objectmodel.qdocinc another-snippet-id
It works as expected. The sequence of QDoc commands and text found between the two tags with the same name as the second argument is sent to the QDoc input stream. You can even have nested snippets.

Note: Snippet identifiers work also within documentation comment (/*! .. */) blocks, so it's not necessary to use a separate .qdocinc file. When processing a comment block, QDoc removes any //! comment lines from the generated output.

## \meta

The \meta command is used for adding metadata to example documentation. The command has two arguments: the first argument is the name of the metadata attribute, and the second argument is the value for the attribute. Each argument should be enclosed in curly brackets, as shown in this example:

/ *!
 \class QWidget
 \brief The QWidget class is the base class of all user interface objects.

 \ingroup basicwidgets

 \meta {technology} {User Interface}
 \meta {platform} {macOS 10.6}
 \meta {platform} {MeeGo}
 \meta {audience} {user}
 \meta {audience} {programmer}
 \meta {audience} {designer}
* /
When running QDoc to generate HTML, the example above will have no effect on the generated output.

Example Metadata

Another use for \meta command is to include metadata (tags) in \example documentation. By default, QDoc generates example tags based on the example's \title and module name. These tags are displayed in Qt Creator's Welcome mode, helping users navigate the list of examples.

Additional tags can be created with \\meta {tag} {tag1,[tag2,...]}. For example:

/ *!
 \example helloworld
 \title Hello World Example
 \meta {tag} {tutorial,basic}
* /
This would result in the following tags: tutorial,basic,hello,world. Common words such as example are ignored.

Example Install Paths

The \meta command combined with an argument installpath specifies the location of an installed example. This value overrides the one that is set using the examplesinstallpath configuration variable.

/ *!
 \example helloworld
 \title Hello World Example
 \meta {installpath} {tutorials}
* /
See also examplesinstallpath.

## \noautolist

The \noautolist command indicates that the annotated list of C++ classes or QML types, which is automatically generated at the bottom of the C++ or QML module page should be omitted, because the classes or types have been listed manually. This command can also be used with the \group command to omit the list of group members, when they are listed manually.

The command must stand on its own line. See Qt Sensors QML Types for an example. The page is generated from qtsensors5.qdoc. There you will find a QDoc comment containing the \qmlmodule command for the QtSensors module. The same QDoc comment contains two \annotated-list commands to list the QML types in two separate groups. The QML types have been divided into these two groups because it makes more sense to list them this way than it does to list them in a single alphabetical list. At the bottom of the comment, \noautolist has been used to tell QDoc not to generate the automatic annotated list.

This command was introduced in QDoc 5.6.

Since Qt 5.10, this command can be applied also to \example documentation, where it causes the automatically generated list of files and images belonging to an example project to be omitted.

## \omit

The \omit command and the corresponding \endomit command delimit parts of the documentation that you want QDoc to skip. For example:

/ *!
 \table
 \row
 \li Basic Widgets
 \li Basic GUI widgets such as buttons, comboboxes
 and scrollbars.

 \omit
 \row
 \li Component Model
 \li Interfaces and helper classes for the Qt
 Component Model.
 \endomit

 \row
 \li Database Classes
 \li Database related classes, e.g. for SQL databases.
 \endtable
* /
QDoc renders this as:

Basic Widgets
Basic GUI widgets such as buttons, comboboxes
 and scrollbars.

Database Classes
Database related classes, e.g. for SQL databases.

## \raw (avoid)

The \raw command and the corresponding \endraw command delimit a block of raw mark-up language code.

Note: Avoid using this command if possible. If you are trying to generate special table or list behavior, try to get the behavior you want using the \span and \div commands in your \table or \list.

The command takes an argument specifying the code's format. Currently, the only supported format is HTML.

The \raw command is useful if you want some special HTML effects in your documentation.

/ *!
 Qt has some predefined QColor objects.

 \raw HTML
 <style type="text/css" id="colorstyles">
 #color-blue { background-color: #0000ff; color: #ffffff }
 #color-darkBlue { background-color: #000080; color: #ffffff }
 #color-cyan { background-color: #00ffff; color: #000000 }
 </style>

 <p>
 <tt id="color-blue">Blue(#0000ff)</tt>,
 <tt id="color-darkBlue">dark blue(#000080)</tt> and
 <tt id="color-cyan">cyan(#00ffff)</tt>.
</p>
 \endraw
* /
QDoc renders this as:

Qt has some predefined QColor objects.

Blue(#0000ff),
 dark blue(#000080) and
 cyan(#00ffff).
 

Note: But you can achieve the exact same thing using QDoc commands. In this case, all you have to do is include the color styles in your style.css file. Then you can write:

\tt {\span {id="color-blue"} {Blue(#0000ff)}},
\tt {\span {id="color-darkBlue"} {dark blue(#000080)}} and
\tt {\span {id="color-cyan"} {cyan(#00ffff)}}.
...which is rendered as:

Blue(#0000ff), dark blue(#000080) and cyan(#00ffff).

## \unicode

The \unicode command allows you to insert an arbitrary Unicode character in the document.

The command takes an argument specifying the character as an integer. By default, base 10 is assumed, unless a '0x' or '0' prefix is specified (for base 16 and 8, respectively). For example:

O G\unicode{0xEA}nio e as Rosas

\unicode 0xC0 table en famille avec 15 \unicode 0x20AC par jour

\unicode 0x3A3 \e{a}\sub{\e{i}}
QDoc renders this as:

O Gênio e as Rosas

À table en famille avec 15 € par jour

Σ ai

Special Content
The QDoc Configuration File

© 2024 The Qt Company Ltd.
 Documentation contributions included herein are the copyrights of
 their respective owners. The documentation provided herein is licensed under the terms of the GNU Free Documentation License version 1.3 as published by the Free Software Foundation. Qt and respective logos are trademarks of The Qt Company Ltd. in Finland and/or other countries
 worldwide. All other trademarks are property of their respective owners. 

 
 
 
 
 Contents
 
 
\annotatedlist

- \generatelist

- annotatedclasses

- annotatedexamples

- annotatedattributions

- classes <prefix>

- classesbymodule

- qmltypesbymodule

- jstypesbymodule

- examplefiles [regular_expression]

- exampleimages [regular_expression]

- functionindex

- legalese

- overviews

- attributions

- related

- \if

- \endif

- \else

- \include

- \include filename snippet-identifier

- \meta

- \noautolist

- \omit

- \raw (avoid)

- \unicode

 
 
 
 Next
 
 
- The QDoc Configuration File

 
 Previous
 
 
- Special Content

 
 
 
 
 
 

 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 Contact Us
 

 
 
 

 

 
- Qt Group
 
 Our Story
 
- Brand
 
- News
 
- Careers
 
- Investors
 
- Qt Products
 
- Quality Assurance Products
 
 
- Licensing
 
 License Agreement
 
- Open Source
 
- Plans and pricing
 
- Download
 
- FAQ
 
 
- Learn Qt
 
 For Learners
 
- For Students and Teachers
 
- Qt Documentation
 
- Qt Forum
 
 
- Support & Services
 
 Professional Services
 
- Customer Success
 
- Support Services
 
- Partners
 
- Qt World
 
 

 
 

 
 
 
 
 
 
- © 2024 The Qt Company
 
- Feedback
 

 Qt Group includes The Qt Company Oy and its global subsidiaries and affiliates.

 
 
 
 
 
 


