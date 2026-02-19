
 

 
 
 Topic Commands | QDoc Manual 5.15.18

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
 
- Topic Commands
 
 
 
 
 
 
 
 

- 

Command Index
Context Commands

# Topic Commands

 
A topic command tells QDoc which source code element is being documented. Some topic commands allow you to create documentation pages that aren't tied to any underlying source code element.

When QDoc processes a QDoc comment, it tries to connect the comment to an element in the source code by first looking for a topic command that names the source code element. If there is no topic command, QDoc tries to connect the comment to the source code element that immediately follows the comment. If it can't do either of these and if there is no topic command that indicates the comment does not have an underlying source code element (e.g. \page), then the comment is discarded.

The name of the entity being documented is usually the only argument for a topic command. Use the complete name. Sometimes there can be a second parameter in the argument. See e.g. \page.

\enum QComboBox::InsertPolicy
The \fn command is a special case. For the \fn command, use the function's signature including the class qualifier.

\fn void QGraphicsWidget::setWindowFlags(Qt::WindowFlags wFlags)
A topic command can appear anywhere in a comment but must stand alone on its own line. It is good practice is to let the topic command be the first line of the comment. If the argument spans several lines, make sure that each line (except the last one) is ended with a backslash. Moreover, QDoc counts parentheses, which means that if it encounters a '(' it considers everything until the closing ')' as its argument.

If a topic command is repeated with different arguments, the same documentation will appear for both the units.

/ *!
 \fn void PreviewWindow::setWindowFlags()
 \fn void ControllerWindow::setWindowFlags()

 Sets the widgets flags using the QWidget::setWindowFlags()
 function.

 Then runs through the available window flags, creating a text
 that contains the names of the flags that matches the flags
 parameter, displaying the text in the widgets text editor.
* /
The PreviewWindow::setWindowFlags() and ControllerWindow::setWindowFlags() functions will get the same documentation.

## \class

The \class command is for documenting a C++ class. The argument is the complete name of the class. The command tells QDoc that a class is part of the public API, and lets you enter a detailed description.

/ *!
 \class QMap::iterator

 \brief The QMap::iterator class provides an STL-style
 non-const iterator for QMap and QMultiMap.

 QMap features both \l{STL-style iterators} and
 \l{Java-style iterators}. The STL-style iterators ...
* /
The HTML documentation for the named class is written to a .html file named from the class name, in lower case, and with the double colon qualifier(s) replaced with '-'. For example, the documentation for the QMap::Iterator class is written to qmap-iterator.html.

The file contains the class description from the \class comment, plus the documentation generated from QDoc comments for all the class members: a list of the class's types, properties, functions, signals, and slots.

In addition to the detailed description of the class, the \class comment typically contains a \brief command and one or more Markup Commands. See the \class command for any of the Qt class for examples. Here is a very simple example:

/ *!
 \class PreviewWindow
 \brief The PreviewWindow class is a custom widget.
 displaying the names of its currently set
 window flags in a read-only text editor.

 \ingroup miscellaneous

 The PreviewWindow class inherits QWidget. The widget
 displays the names of its window flags set with the \l
 {function} {setWindowFlags()} function. It is also
 provided with a QPushButton that closes the window.

 ...

 \sa QWidget
* /
The way QDoc renders this \class will depend a lot on your style.css file, but the general outline of the class reference page will look like this:

 
# PreviewWindow Class Reference

The PreviewWindow class is a custom widget displaying the names of its currently set window flags in a read-only text editor. More...

### Properties

52 properties inherited from QWidget

- 1 property inherited from QObject

### Public Functions

- PreviewWindow(QWidget *parent = 0)

- void setWindowFlags(Qt::WindowFlags flags)

- 183 public functions inherited from QWidget

- 28 public functions inherited from QObject

### Public Slots

- 17 public slots inherited from QWidget

- 1 public slot inherited from QObject

### Additional Inherited Members

- 1 signal inherited from QWidget

- 1 signal inherited from QObject

- 4 static public members inherited from QWidget

- 4 static public members inherited from QObject

- 39 protected functions inherited from QWidget

- 7 protected functions inherited from QObject

 

## Detailed Description

The PreviewWindow class is a custom widget displaying the names of its currently set window flags in a read-only text editor.

The PreviewWindow class inherits QWidget. The widget displays the names of its window flags set with the setWindowFlags() function. It is also provided with a QPushButton that closes the window.

...

See also QWidget.

## Member Function Documentation

 
### PreviewWindow(QWidget *parent = 0)

Constructs a preview window widget with parent.

 
### setWindowFlags(Qt::WindowFlags flags)

Sets the widgets flags using the QWidget::setWindowFlags() function.

Then runs through the available window flags, creating a text that contains the names of the flags that matches the flags parameter, displaying the text in the widgets text editor.

## \enum

The \enum command is for documenting a C++ enum type. The argument is the full name of the enum type.

The enum values are documented in the \enum comment using the \value command. If an enum value is not documented with \value, QDoc emits a warning. These warnings can be avoided using the \omitvalue command to tell QDoc that an enum value should not be documented. The enum documentation will be included on the class reference page, header file page, or namespace page where the enum type is defined. For example, consider the enum type Corner in the Qt namespace:

enum Corner {
 TopLeftCorner = 0x00000,
 TopRightCorner = 0x00001,
 BottomLeftCorner = 0x00002,
 BottomRightCorner = 0x00003
#if defined(QT3_SUPPORT) && !defined(Q_MOC_RUN)
 ,TopLeft = TopLeftCorner,
 TopRight = TopRightCorner,
 BottomLeft = BottomLeftCorner,
 BottomRight = BottomRightCorner
#endif
};
This enum can be cocumented this way:

/ *!
 \enum Qt::Corner

 This enum type specifies a corner in a rectangle:

 \value TopLeftCorner
 The top-left corner of the rectangle.
 \value TopRightCorner
 The top-right corner of the rectangle.
 \value BottomLeftCorner
 The bottom-left corner of the rectangle.
 \value BottomRightCorner
 The bottom-right corner of the rectangle.

 \omitvalue TopLeft
 \omitvalue TopRight
 \omitvalue BottomLeft
 \omitvalue BottomRight
* /
Note the inclusion of the namespace qualifier. QDoc will render this enum type in qt.html like this:

 
### enum Qt::Corner

This enum type specifies a corner in a rectangle:

Constant
Value
Description

Qt::TopLeftCorner
0x00000
The top-left corner of the rectangle.

Qt::TopRightCorner
0x00001
The top-right corner of the rectangle.

Qt::BottomLeftCorner
0x00002
The bottom-left corner of the rectangle.

Qt::BottomRightCorner
0x00003
The bottom-right corner of the rectangle.

See also \value and \omitvalue.

## \example

The \example command is for documenting an example. The argument is the example's path relative to one of the paths listed in the exampledirs variable in the QDoc configuration file.

The documentation page will be output to modulename-path-to-example.html. QDoc will add a list of all the example's source and images files at the end of the page, unless \noautolist command is used or the configuration variable url.examples is defined for the project.

For example, if exampledirs contains $QTDIR/examples/widgets/imageviewer, then

/ *!
 \example widgets/imageviewer
 \title ImageViewer Example
 \subtitle

 The example shows how to combine QLabel and QScrollArea
 to display an image.

 ...
* /
QDoc renders this example in widgets-imageviewer.html:

 
# Image Viewer Example

The example shows how to combine QLabel and QScrollArea to display an image.

Files:

- widgets/imageviewer/imageviewer.cpp

- widgets/imageviewer/imageviewer.h

- widgets/imageviewer/main.cpp

...

See also: \generatelist examplefiles, \noautolist, url.examples, \meta

## \externalpage

The \externalpage command assigns a title to an external URL.

/ *!
 \externalpage http://doc.qt.io/
 \title Qt Documentation Site
* /
This allows you to include a link to the external page in your documentation this way:

/ *!
 At the \l {Qt Documentation Site} you can find the latest
 documentation for Qt, Qt Creator, the Qt SDK and much more.
* /
QDoc renders this as:

At the Qt Documentation Site you can find the latest documentation for Qt, Qt Creator, the Qt SDK and much more.

To achieve the same result without using the \externalpage command, you would have to hard-code the address into your documentation:

/ *!
 At the \l {http://doc.qt.io/}{Qt Documentation Site}
 you can find the latest documentation for Qt, Qt Creator, the Qt SDK
 and much more.
* /
The \externalpage command makes it easier to maintain the documentation. If the address changes, you only need to change the argument of the \externalpage command.

## \fn (function)

The \fn command is for documenting a function. The argument is the function's signature, including its return type, const-ness, and list of formal arguments with types. If the named function doesn't exist, QDoc emits a warning.

Note: The \fn command is QDoc's default command: when no topic command can be found in a QDoc comment, QDoc tries to tie the documentation to the following code as if it is the documentation for a function. Hence, it is normally not necessary to include this command when documenting a function, if the function's QDoc comment is written immediately above the function implementation in the .cpp file. But it must be present when documenting an inline function in the .cpp file that is implemented in the .h file.

/ *!
 \fn bool QToolBar::isAreaAllowed(Qt::ToolBarArea area) const

 Returns \c true if this toolbar is dockable in the given
 \a area; otherwise returns \c false.
* /
QDoc renders this as:

 
### bool QToolBar::isAreaAllowed(Qt::ToolBarArea area) const
 

Returns true if this toolbar is dockable in the given area; otherwise returns false.

See also \overload.

## \group

The \group command creates a separate page that lists the classes belonging to the group. The argument is the group name.

A class is included in a group by using the \ingroup command. Overview pages can also be related to a group using the same command, but the list of overview pages must be requested explicitly using the \generatelist command (see example below).

The \group command is typically followed by a \title command and a short introduction to the group. The HTML page for the group is written to a .html file put in <lower-case>group.html.

Each class name is listed as a link to the class reference page followed by the text from the class's \brief texts.

/ *!
 \group io

 \title Input/Output and Networking

 These classes are used to handle input and output to
 and from external devices, processes, files etc., as
 well as manipulating files and directories.
* /
QDoc generates a group page in io.html that will look like this:

 
# Input/Output and Networking

These classes are used to handle input and output
 to and from external devices, processes, files etc., as
 well as manipulating files and directories.

QAbstractSocket

 The base functionality common to all socket types
 

QBuffer

 QIODevice interface for a QByteArray
 

QClipboard

 Access to the window system clipboard
 

Note that overview pages related to the group, must be listed explicitly using the \generatelist command with the related argument.

/ *!
 \group architecture

 \title Architecture

 These documents describe aspects of Qt's architecture
 and design, including overviews of core Qt features and
 technologies.

 \generatelist{related}
* /

See also \ingroup and \generatelist.

## \headerfile

The \headerfile command is for documenting the global functions, types and macros that are declared in a header file, but not in a namespace. The argument is the name of the header file. The HTML page is written to a .html file constructed from the header file argument.

The documentation for a function, type, or macro that is declared in the header file being documented, is included in the header file page using the \relates command.

If the argument doesn't exist as a header file, the \headerfile command creates a documentation page for the header file anyway.

/ *!
 \headerfile <QtAlgorithms>

 \title Generic Algorithms

 \brief The <QtAlgorithms> header file provides
 generic template-based algorithms.

 Qt provides a number of global template functions in \c
 <QtAlgorithms> that work on containers and perform
 well-know algorithms.
* /
QDoc generates a header file page qtalgorithms.html that looks like this:

 
# <QtAlgorithms> -
 Generic Algorithms

The header file provides generic
 template-based algorithms.
 More...

### Functions

- RandomAccessIterator
 qBinaryFind
 (RandomAccessIterator begin, RandomAccessIterator end,
 const T & value)

- ...

 
## Detailed Description

The header file provides generic
 template-based algorithms. 

Qt provides a number of global template functions in <QtAlgorithms> that work on containers and perform well-know algorithms.

...

See also \inheaderfile.

## \macro

The \macro command is for documenting a C++ macro. The argument is the macro in one of three styles: function-like macros like Q_ASSERT(), declaration-style macros like Q_PROPERTY(), and macros without parentheses like Q_OBJECT.

The \macro comment must contain a \relates command that attaches the macro comment to a class, header file, or namespace. Otherwise, the documentation will be lost. Here are three example macro comments followed by what they might look like in qtglobal.html or qobject.html:

/ *!
 \macro void Q_ASSERT(bool test)
 \relates <QtGlobal>

 Prints a warning message containing the source code
 file name and line number if \a test is false.

 ...

 \sa Q_ASSERT_X(), qFatal(), {Debugging Techniques}
* /
 
### void Q_ASSERT ( bool test )

Prints a warning message containing the source code file name and line number if test is false.

...

See also Q_ASSERT_X(), qFatal() and Debugging Techniques.

/ *!
 \macro Q_PROPERTY(...)
 \relates QObject

 This macro declares a QObject property. The syntax is:

 ...

 \sa {Qt's Property System}
* /

 
### Q_PROPERTY ( ... )

This macro declares a QObject property. The syntax is:

...

See also Qt's Property System.

/ *!
 \macro Q_OBJECT
 \relates QObject

 The Q_OBJECT macro must appear in the private section
 of a class definition that declares its own signals and
 slots, or that uses other services provided by Qt's
 meta-object system.

 ...

 \sa {Meta-Object System}, {Signals and Slots}, {Qt's
 Property System}
* /
 
### Q_OBJECT

The Q_OBJECT macro must appear in the private section of a class definition that declares its own signals and slots or that uses other services provided by Qt's meta-object system.

...

See also Meta-Object System, Signals & Slots and Qt's Property System.

## \module

The \module creates a page that lists the classes belonging to the module specified by the command's argument. A class included in the module by including the \inmodule command in the \class comment.

The \module command is typically followed by a \title and a \brief command. Each class is listed as a link to the class reference page followed by the text from the class's \brief command. For example:

/ *!
 \module QtNetwork

 \title Qt Network Module

 \brief Contains classes for writing TCP/IP clients and servers.

 The network module provides classes to make network
 programming easier and portable. It offers both
 high-level classes such as QNetworkAccessManager that
 implements application-level protocols, and
 lower-level classes such as QTcpSocket, QTcpServer, and
 QUdpSocket.
* /
QDoc renders this in qtnetwork.html like this:

 
# Qt Network Module

The Qt Network module offers classes that allow you to write TCP/IP clients and servers.More...

QAbstractSocket

 The base functionality common to all socket types
 

...
...

 
## Detailed Description

 The Qt Network module offers classes that allow you to
 write TCP/IP clients and servers.
 

 The network module provides classes to make network
 programming easier and portable. It offers both
 high-level classes such as QNetworkAccessManager that
 implements application-level protocols, and
 lower-level classes such as QTcpSocket, QTcpServer, and
 QUdpSocket.
 

...

The \noautolist command can be used here to omit the automatically generated list of classes at the end.

See also \inmodule

## \namespace

The \namespace command is for documenting the contents of the C++ namespace named as its argument. The reference page QDoc generates for a namespace is similar to the reference page it generates for a C++ class.

/ *!
 \namespace Qt

 \brief Contains miscellaneous identifiers used throughout the Qt library.
* /
QDoc renders this in qt.html like this:

 
# Qt Namespace

The Qt namespace contains miscellaneous
 identifiers used throughout the Qt library.
 More...

#include <Qt>

- 

 Obsolete members

### Types

- flags
 Alignment

- ...

 
## Detailed Description

Contains miscellaneous identifiers
 used throughout the Qt library.

...

Note that in C++, a particular namespace can be used in more than one module, but when C++ elements from different modules are declared in the same namespace, the namespace itself must be documented in one module only. For example, namespace Qt in the example above contains types and functions from both QtCore and QtGui, but it is documented with the \namespace command only in QtCore.

## \page

The \page command is for creating a stand-alone documentation page. The argument can consist of two parts separated by a space. The first part is the name of the file where QDoc should store the page. The second part, if present, is a word that specifies the page type. Currently, the second part can be one of the following list of words:

- api - This is the type of page used for C++ class references and QML type references. You should never use this one for the pages you write, because this one is reserved for QDoc.

- attribution - A page describing (code) attributions.

- example - A page that describes a working example.

- faq - A frequently asked question.

- howto - A user guide on how to use some components of the software.

- overview - For text pages that provide an overview of some important subject.

- tutorial - For text pages that are part of a tutorial.

The page title is set using the \title command.

/ *!
 \page aboutqt.html

 \title About Qt

 Qt is a C++ toolkit for cross-platform GUI
 application development. Qt provides single-source
 portability across Microsoft Windows, macOS, Linux,
 and all major commercial Unix variants.

 Qt provides application developers with all the
 functionality needed to build applications with
 state-of-the-art graphical user interfaces. Qt is fully
 object-oriented, easily extensible, and allows true
 component programming.

 ...
 * /
QDoc renders this page in aboutqt.html.

## \property

The \property command is for documenting a Qt property. The argument is the full property name.

A property is defined using the Q_PROPERTY() macro. The macro takes as arguments the property's name and its set, reset and get functions.

Q_PROPERTY(QString state READ state WRITE setState)
The set, reset and get functions don't need to be documented, documenting the property is sufficient. QDoc will generate a list of the access function that will appear in the property documentation which in turn will be located in the documentation of the class that defines the property.

The \property command comment typically includes a \brief command. For properties the \brief command's argument is a sentence fragment that will be included in a one line description of the property. The command follows the same rules for the description as the \variable command.

/ *!
 \property QPushButton::flat
 \brief Whether the border is disabled.

 This property's default is false.
* /

QDoc includes this in qpushbutton.html like this:

 
### flat : bool

This property holds whether the border is disabled.

This property's default is false.

Access functions:

- bool isFlat () const

- void setFlat ( bool )

/ *!
 \property QWidget::width
 \brief The width of the widget excluding any window frame.

 See the \l {Window Geometry} documentation for an
 overview of window geometry.

 \sa geometry, height, size
* /
QDoc includes this in qwidget.html like this:

 
### width : const int

This property holds the width of the widget excluding any window frame.

See the Window Geometry documentation for an overview of window geometry.

Access functions:

- int width () const

See also geometry, height, and size.

## \qmlattachedproperty

The \qmlattachedproperty command is for documenting a QML property that will be attached to some QML type. See Attached Properties. The argument is the rest of the line. The argument text should be the property type, followed by the QML element name where the property is being declared, the :: qualifier, and finally the property name. If we have a QML attached property named isCurrentItem in QML ListView, and the property has type bool, the \qmlattachedproperty for it would look like this:

/ *!
 \qmlattachedproperty bool ListView::isCurrentItem
 This attached property is \c true if this delegate is the current
item; otherwise false.

 It is attached to each instance of the delegate.

 This property may be used to adjust the appearance of the current
item, for example:

 \snippet doc/src/snippets/declarative/listview/listview.qml isCurrentItem
* /
QDoc includes this attached property on the QML reference page for the ListView element.

## \qmlattachedsignal

The \qmlattachedsignal command is for documenting an attachable signal. The \qmlattachedsignal command is used just like the \qmlsignal command.

The argument is the rest of the line. It should be the name of the QML type where the signal is declared, the :: qualifier, and finally the signal name. For example, a QML attached signal named add() in the GridView element is documented like this:

/ *!
 \qmlattachedsignal GridView::add()
 This attached signal is emitted immediately after an item is added to the view.
* /
QDoc includes this documentation on the QML reference page for the GridView element.

## \qmlbasictype

The \qmlbasictype command is for documenting a basic type for QML. The argument is the type name. The type must be included in the QML basic types group using the \ingroup command as shown below. This will cause QDoc to include the documentation for the type on the QML Basic Types page. The \brief command is also required, because it appears on the QML Basic Types page as well.

/ *!
 \qmlbasictype int
 \ingroup qmlbasictypes

 \brief An integer is a whole number, for example 0, 10, or -20.

 An integer is a whole number, e.g. 0, 10, or -20. The possible
 \c int values range from around -2000000000 to around
 2000000000, although most elements will only accept a reduced
 range (which they mention in their documentation).

 Example:
 \qml
 Item { width: 100; height: 200 }
 \endqml

 \sa {QML Basic Types}
* /
QDoc outputs this as qml-int.html.

## \qmlclass

This command is deprecated. Use \qmltype instead.

The \qmlclass command is for documenting a QML type that is instantiated by a C++ class. The command has two arguments. The first argument is the name of the QML type. The second argument is the name of the C++ class that instantiates the QML type.

/ *!
 \qmlclass Transform QGraphicsTransform
 \ingroup qml-transform-elements
 \since 4.7
 \brief Provides a way of building advanced transformations on Items.

 The Transform element is a base type which cannot be
 instantiated directly. The following concrete Transform types
 are available:

 \list
 \li \l Rotation
 \li \l Scale
 \li \l Translate
 \endlist

 The Transform elements let you create and control advanced
 transformations that can be configured independently using
 specialized properties.

 You can assign any number of Transform elements to an \l
 Item. Each Transform is applied in order, one at a time.

* /
This example generates the QML Transform page. The \qmlclass comment should include the \since command, because all QML types are new. It should also include the \brief command. If a type is a member of a group of QML types, it should also include one or more \ingroup commands.

## \qmlmethod

The \qmlmethod command is for documenting a QML method. The argument is the complete method signature, including return type and parameter names and types.

/ *!
 \qmlmethod void TextInput::select(int start, int end)

 Causes the text from \a start to \a end to be selected.

 If either start or end is out of range, the selection is not changed.

 After having called this, selectionStart will become the lesser, and
 selectionEnd the greater (regardless of the order passed to this method).

 \sa selectionStart, selectionEnd
* /
QDoc includes this documentation on the element reference page for the TextInput element.

## \qmltype

The \qmltype command is for documenting a QML type. The command has one argument, which is the name of the QML type.

If the QML type is instantiated by a C++ class, that class must be specified using the \instantiates context command.

/ *!
 \qmltype Transform
 \instantiates QGraphicsTransform
 \ingroup qml-transform-elements
 \since 4.7
 \brief The Transform elements provide a way to build
 advanced transformations on Items.

 The Transform element is a base type which cannot be
 instantiated directly. The concrete Transform types are:

 \list
 \li \l Rotation
 \li \l Scale
 \li \l Translate
 \endlist

 The Transform elements let you create and control advanced
 transformations that can be configured independently using
 specialized properties.

 You can assign any number of Transform elements to an \l
 Item. Each Transform is applied in order, one at a time.

* /
The example generates the QML Transform page. The \qmltype comment includes \instantiates to specify that a Transform is instantiated by the C++ class QGraphicsTransform. A \qmltype comment should always include a \since command, because all QML types are new. It should also include a \brief description. If a QML type is a member of a QML type group, the \qmltype comment should include one or more \ingroup commands.

## \qmlproperty

The \qmlproperty command is for documenting a QML property. The argument is the rest of the line. The argument text should be the property type, followed by the QML type name, the :: qualifier, and finally the property name. If we have a QML property named x in QML type Translate, and the property has type real, the \qmlproperty for it would look like this:

/ *!
 \qmlproperty real Translate::x

 The translation along the X axis.
* /
QDoc includes this QML property on the QML reference page for the Translate element.

If the QML property is of enumeration type, or it holds a bit-wise combination of flags, the \value command can be used to document the acceptable values.

## \qmlsignal

The \qmlsignal command is for documenting a QML signal. The argument is the rest of the line. The arguments should be: the QML type where the signal is declared, the :: qualifier, and finally the signal name. If we have a QML signal named clicked(), the documentation for it would look like this:

/ *!
\qmlsignal QtQuick::MouseArea::clicked(MouseEvent mouse)
This signal is emitted when there is a click. A click is defined as a
press followed by a release, both inside the MouseArea.
* /
QDoc includes this documentation on the QML reference page for the MouseArea element.

## \qmlmodule

Insert the \\qmlmodule command to create a QML module page. A QML module is a collection of QML types or any related material. This command is similar to the group-command.

A QML class may belong to a module by inserting the \inqmlmodule command as a topic command. Every member of a group must be linked to using the module name and two colons (::).

\beginqdoc
 A link to the TabWidget of the UI Component is \l {UIComponent::TabWidget}.
\endqdoc
QDoc will generate a page for the module with a listing of the members of the module.

\qmlmodule ClickableComponents

This is a list of the Clickable Components set. A Clickable component
responds to a \c clicked() event.

## \inqmlmodule

A QML class may belong to a QML module by inserting the \inqmlmodule command as a topic command, with the module name (without a version number) as the only argument. Every member of a group must be linked to using the module name and two colons (::).

\qmltype ClickableButton
\inqmlmodule ClickableComponents

A clickable button that responds to the \c click() event.
To link to the ClickableButton, use the \l ClickableComponents::ClickableButton format.

The \noautolist command can be used here to omit the automatically generated list of types at the end.

## \instantiates

The \instantiates command is used in the QML type comment of an elemental QML type to specify the name of the C++ class that instantiates the QML type.

If the QML type is not instantiated by a C++ class, this command is not used.

/ *!
 \qmltype Transform
 \instantiates QGraphicsTransform
 \ingroup qml-transform-elements
 \since 4.7
 \brief Provides elements provide a way to build
 advanced transformations on Items.

 The Transform element is a base type which cannot be
 instantiated directly.
* /
The example generates the QML Transform page. The \qmltype comment includes \instantiates to specify that a Transform is instantiated by the C++ class QGraphicsTransform. A \qmltype comment should

## \typealias

The \typealias command is similar to \typedef, but specific to documenting a C++ type alias:

class Foo
{
public:
 using ptr = void*;
// ...
}
This can be documented as

/*!
 \typealias Foo::ptr
*/
QDoc will automatically generate a sentence in the documentation describing the alias:

This is a type alias for void*.

The \typealias command was introduced in QDoc 5.15.

See also \typedef.

## \typedef

The \typedef command is for documenting a C++ typedef. The argument is the name of the typedef. The documentation for the typedef will be included in the reference documentation for the class, namespace, or header file in which the typedef is declared. To relate the \typedef to a class, namespace, or header file, the \typedef comment must contain a \relates command.

/ *!
 \typedef QObjectList
 \relates QObject

 Synonym for QList<QObject>.
* /
QDoc includes this in qobject.html as:

 
### typedef QObjectList

Synonym for QList<QObject>.

Another, although more rare, example:

/ *!
 \typedef QMsgHandler
 \relates QtGlobal

 This is a typedef for a pointer to a function with the
 following signature:

 \code
 void myMsgHandler(QtMsgType, const char *);
 \ endcode

 \sa QtMsgType, qInstallMessageHandler()
* /
QDoc includes this in qtglobal.html as:

 
### typedef QtMsgHandler

This is a typedef for a pointer to a function with the following signature:

 void myMsgHandler(QtMsgType, const char *);

See also QtMsgType and qInstallMessageHandler().

Other typedefs are located on the reference page for the class that defines them.

/ *!
 \typedef QLinkedList::Iterator

 Qt-style synonym for QList::iterator.
* /
QDoc includes this one on the reference page for class QLinkedList as:

 
### typedef QLinkedList::Iterator

Qt-style synonym for QList::iterator.

See also \typealias.

## \variable

The \variable command is for documenting a class member variable or a constant. The argument is the variable or constant name. The \variable command comment includes a \brief command. QDoc generates the documentation based on the text from \brief command.

The documentation will be located in the in the associated class, header file, or namespace documentation.

In case of a member variable:

/ *!
 \variable QStyleOption::palette
 \brief The palette that should be used when painting
 the control
* /
QDoc includes this in qstyleoption.html as:

 
### 

 QPalette
 
 QStyleOption::palette
 

This variable holds the palette that should be used when painting the control.

You can also document constants with the \variable command. For example, suppose you have the Type and UserType constants in the QTreeWidgetItem class:

enum { Type = 0, UserType = 1000 };
For these, the \variable command can be used this way:

/ *!
 \variable QTreeWidgetItem::Type

 The default type for tree widget items.

 \sa UserType, type()
* /
/ *!
 \variable QTreeWidgetItem::UserType

 The minimum value for custom types. Values below
 UserType are reserved by Qt.

 \sa Type, type()
* /
QDoc includes these in qtreewidget.html as:

 
### 
 const int QTreeWidgetItem::Type
 

The default type for tree widget items.

See also UserType and type().

### 
 const int QTreeWidgetItem::UserType
 

The minimum value for custom types. Values below UserType are reserved by Qt.

See also Type and type().

Command Index
Context Commands

© 2024 The Qt Company Ltd.
 Documentation contributions included herein are the copyrights of
 their respective owners. The documentation provided herein is licensed under the terms of the GNU Free Documentation License version 1.3 as published by the Free Software Foundation. Qt and respective logos are trademarks of The Qt Company Ltd. in Finland and/or other countries
 worldwide. All other trademarks are property of their respective owners. 

 
 
 
 
 Contents
 
 

- \class

- \enum

- \example

- \externalpage

- \fn (function)

- \group

- \headerfile

- \macro

- \module

- \namespace

- \page

- \property

- \qmlattachedproperty

- \qmlattachedsignal

- \qmlbasictype

- \qmlclass

- \qmlmethod

- \qmltype

- \qmlproperty

- \qmlsignal

- \qmlmodule

- \inqmlmodule

- \instantiates

- \typealias

- \typedef

- \variable

 
 
 
 Next
 
 
- Context Commands

 
 Previous
 
 
- Command Index

 
 
 
 
 
 

 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
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

 
 
 
 
 
 


