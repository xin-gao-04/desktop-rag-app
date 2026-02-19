
 

 
 
 Text Markup | QDoc Manual 5.15.18

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
 
- Text Markup
 
 
 
 
 
 
 
 

- 

Markup Commands
Document Structure

# Text Markup

 
The text formatting commands indicate how text is to be rendered.

## \a (parameter marker)

The \a command tells QDoc the next word is a formal parameter name.

A warning is emitted when a formal parameter is not documented or is misspelled, so when you document a function you should mention each formal parameter by name in the function description, preceded by the \a command. The parameter name is then rendered in italics.

/ *!
 Constructs a line edit containing the text
 \a contents. The \a parent parameter is sent
 to the QWidget constructor.
* /

QLineEdit::QLineEdit(const QString &contents, QWidget *parent) :QWidget(parent)
{
 ...
}
QDoc renders this as:

QLineEdit::QLineEdit ( const QString & contents, QWidget *parent )

Constructs a line edit containing the text contents. The parent parameter is sent to the QWidget constructor.

The formal parameter name may be enclosed between curly brackets, but that isn't required.

## \c (code font)

The \c command is used for rendering variable names, user-defined class names, and C++ keywords (for example, int and for) in the code font.

The command renders its argument using a monospace font. For example:

/ *!
 The \c AnalogClock class provides a clock widget with hour
 and minute hands that is automatically updated every
 few seconds.
* /
QDoc renders this as:

The AnalogClock class provides a clock widget with hour and minute hands, which are automatically updated every few seconds.

If the text to be rendered in the code font contains spaces, enclose the entire text in curly brackets.

\c {QLineEdit::QLineEdit(const QString &contents, QWidget *parent) :QWidget(parent)}
QDoc renders this as:

QLineEdit::QLineEdit(const QString &contents, QWidget *parent) :QWidget(parent)

The \c command accepts the special character \ within its argument, which renders it as a normal character. So if you want to use nested commands, you must use the teletype (\tt) command instead.

See also \tt and \code.

## \div

The \div and \enddiv commands delimit a large or small block of text (which may include other QDoc commands) to which special formatting attributes should be applied.

An argument must be provided in curly braces, as in the QDoc comment shown below. The argument is not interpreted but is used as attribute(s) of the tag that is output by QDoc.

For example, we might want to render an inline image so that it floats to the right of the current block of text:

/ *!
 \div {class="float-right"}
 \inlineimage qml-column.png
 \enddiv

* /
If QDoc is generating HTML, it will translate these commands to:

<div class="float-right"><p><img src="images/qml-column.png" /></p></div>
For HTML, the attribute value float-right then will refer to a clause in the style.css file, which in this case could be:

div.float-right
{
 float: right; margin-left: 2em
}

Note: Note that the \div command can be nested.

Below you can find an example taken from the index.qdoc file used to generate index.html for Qt 4.7:

\div {class="indexbox guide"}
 \div {class="heading"}
 Qt Developer Guide
\enddiv
 \div {class="indexboxcont indexboxbar"}
 \div {class="section indexIcon"} \emptyspan
 \enddiv
 \div {class="section"}
 Qt is a cross-platform application and UI
 framework. Using Qt, you can write web-enabled
 applications once and deploy them across desktop,
 mobile and embedded operating systems without
 rewriting the source code.
 \enddiv
 \div {class="section sectionlist"}
 \list
 \li \l{Getting Started}
 \li \l{Installation} {Installation}
 \li \l{how-to-learn-qt.html} {How to learn Qt}
 \li \l{tutorials.html} {Tutorials}
 \li \l{Qt Examples} {Examples}
 \li \l{qt4-7-intro.html} {What's new in Qt 4.7}
 \endlist
 \enddiv
 \enddiv
\enddiv

When all the class attribute values are defined as they are in the style.css file that is used for rendering the Qt documentation, the above example is rendered as:

Qt Developer Guide

Qt is a cross-platform application and UI framework. Using Qt, you can write web-enabled applications once and deploy them across desktop, mobile and embedded operating systems without rewriting the source code.

Getting Started

- Installation

- How to learn Qt

- Tutorials

- Examples

- What's new in Qt 4.7

See also \span.

## \span

The \span command applies special formatting to a small block of text.

Two arguments must be provided, each argument in curly braces, as shown in the QDoc comment below. The first argument is not interpreted, but specifies the formatting attribute(s) of the tag output by QDoc. The second argument is the text to be rendered with the special formatting attributes.

For example, we might want to render the first word of each element in a numeric list in blue.

/ *!
 Global variables with complex types:
\list 1
 \li \span {class="variableName"} {mutableComplex1} in globals.cpp at line 14
 \li \span {class="variableName"} {mutableComplex2} in globals.cpp at line 15
 \li \span {class="variableName"} {constComplex1} in globals.cpp at line 16
 \li \span {class="variableName"} {constComplex2} in globals.cpp at line 17
 \endlist
* /
Class variableName refers to a clause in your style.css.

.variableName
{
 font-family: courier;
color: blue
}
Using the variableName clause shown above, the example is rendered as:

Global variables with complex types:

- mutableComplex1 in globals.cpp at line 14

- mutableComplex2 in globals.cpp at line 15

- constComplex1 in globals.cpp at line 16

- constComplex2 in globals.cpp at line 17

Note: The span command does not cause a new paragraph to be started.

See also \div.

## \tt (teletype font)

The \tt command renders its argument in a monospace font. This command behaves just like the \c command, except that \tt allows you to nest QDoc commands within the argument (e.g. \e, \b and \underline).

/ *!
 After having populated the main container with
 child widgets, \c setupUi() scans the main container's list of
 slots for names with the form
 \tt{on_\e{objectName}_\e{signalName}().}
* /

QDoc renders this as:

After having populated the main container with child widgets, setupUi() scans the main container's list of slots for names with the form on_objectName_signalName().

If the text to be rendered in the code font contains spaces, enclose the entire text in curly brackets.

\tt {QLineEdit::QLineEdit(const QString &contents, QWidget *parent) :QWidget(parent)}
QDoc renders this as:

QLineEdit::QLineEdit(const QString &contents, QWidget *parent) :QWidget(parent)

See also \c.

## \b

The \b command renders its argument in bold font. This command used to be called \bold.

/ *!
 This is regular text; \b {this text is
 rendered using the \\b command}.
* /
QDoc renders this as:

This is regular text; this text is rendered using the \b command.

## \e (emphasis, italics)

The \e command renders its argument in a special font, normally italics. This command used to be called \i, which is now deprecated.

If the argument contains spaces or other punctuation, enclose the argument in curly brackets.

/ *!
 Here, we render \e {a few words} in italics.
* /
QDoc renders this as:

Here, we render a few words in italics.

If you want to use other QDoc commands within an argument that contains spaces, you always need to enclose the argument in braces. But QDoc is smart enough to count parentheses [3], so you don't need braces in cases like this:

/ *!
 An argument can sometimes contain whitespaces,
 for example: \e QPushButton(tr("A Brand New Button"))
* /
QDoc renders this as:

An argument can sometimes contain whitespaces, for example: QPushButton(tr("A Brand New Button"))

Finally, trailing punctuation is not included in an argument [4], nor is "'s" [5]

QDoc Syntax
Generated Documentation

1
A variation of a command button is a \e menu
 button.
A variation of a command button is a menu
 button.

2
The QPushButton widget provides a
 \e {command button}.
The QPushButton widget provides a
 command button.

3
Another class of buttons are option buttons
 \e (see QRadioButton).
Another class of buttons are option buttons
 (see QRadioButton).

4
A push button emits the signal \e clicked().
A push button emits the signal clicked().

5
The \e QPushButton's checked property is
 false by default.
The QPushButton's checked property is
 false by default.

## \sub

The \sub command renders its argument lower than the baseline of the regular text, using a smaller font.

/ *!
 Definition (Range): Consider the sequence
 {x\sub n}\sub {n > 1} . The set

 {x\sub 2, x\sub 3, x\sub 4, ...} = {x\sub n ; n = 2, 3, 4, ...}

 is called the range of the sequence.
* /
QDoc renders this as:

Definition (Range): Consider the sequence {xn}n > 1 . The set

{x2, x3, x4, ...} = {xn ; n = 2, 3, 4, ...}

is called the range of the sequence.

If the argument contains spaces or other punctuation, enclose the argument in curly brackets.

## \sup

The \sup command renders its argument higher than the baseline of the regular text, using a smaller font.

/ *!
 The series

 1 + a + a\sup 2 + a\sup 3 + a\sup 4 + ...

 is called the \i {geometric series}.
* /
QDoc renders this as:

The series

1 + a + a2 + a3 + a4 + ...

is called the geometric series.

If the argument contains spaces or other punctuation, enclose the argument in curly brackets.

## \uicontrol

The \uicontrol command is used to mark content as being used for UI control elements. When using HTML, the output is rendered in bold.

## \underline

The \underline command renders its argument underlined.

/ *!
 The \underline {F}ile menu gives the users the possibility
 to edit an existing file, or save a new or modified
 file, and exit the application.
* /
QDoc renders this as:

The File menu gives the users the possibility to edit an existing file, or save a new or modified file, and exit the application.

If the argument contains spaces or other punctuation, enclose the argument in curly brackets.

## \\ (double backslash)

The \\ command expands to a double backslash.

QDoc commands always start with a single backslash. To display a single backslash in the text you need to type two backslashes. If you want to display two backslashes, you need to type four.

/ *!
 The \\\\ command is useful if you want a
 backslash to appear verbatim, for example,
 writing C:\\windows\\home\\.
* /
QDoc renders this as:

The \\ command is useful if you want a backslash to appear verbatim, for example, writing C:\windows\home\.

However, if you want your text to appear in a monospace font as well, you can use the \c command instead, which accepts and renders the backslash as any other character. For example:

/ *!
 The \\c command is useful if you want a
 backslash to appear verbatim, and the word
 that contains it written in a monospace font,
 like this: \c {C:\windows\home\}.
* /
QDoc renders this as:

The \c command is useful if you want a backslash to appear verbatim, and the word that contains it written in a monospace font, like this: C:\windows\home\.

See also \b.

Markup Commands
Document Structure

© 2024 The Qt Company Ltd.
 Documentation contributions included herein are the copyrights of
 their respective owners. The documentation provided herein is licensed under the terms of the GNU Free Documentation License version 1.3 as published by the Free Software Foundation. Qt and respective logos are trademarks of The Qt Company Ltd. in Finland and/or other countries
 worldwide. All other trademarks are property of their respective owners. 

 
 
 
 
 Contents
 
 

- \a (parameter marker)

- \c (code font)

- \div

- \span

- \tt (teletype font)

- \b

- \e (emphasis, italics)

- \sub

- \sup

- \uicontrol

- \underline

- \\ (double backslash)

 
 
 
 Next
 
 
- Document Structure

 
 Previous
 
 
- Markup Commands

 
 
 
 
 
 

 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
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

 
 
 
 
 
 


