
 

 
 
 Creating Links | QDoc Manual 5.15.18

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
 
- Creating Links
 
 
 
 
 
 
 
 

- 

Including External Code
Including Images

# Creating Links

 
These commands are for creating hyperlinks to classes, functions, examples, and other targets.

## \l (link)

The \l link command is used to create a hyperlink to many different kinds of targets. The command's general syntax is:

\l [ link criteria ] { link target } { link text }
...where the link criteria in square brackets are optional but may be required when the link target is ambiguous. See Fixing Ambiguous Links below.

Here is an example using the \l command to link to an external page:

/ *!
 Read the \l {http://doc.qt.io/qt-5/}
 {Qt 5.0 Documentation} carefully.
* /
QDoc renders this as:

Read the Qt 5.0 Documentation carefully.

If the link target is equivalent to the link text, the second argument can be omitted.

For example, if you have documentation like:

/ *!
 \target assertions

 Assertions make some statement about the text at the
 point where they occur in the regexp, but they do not
 match any characters.

 ...

 Regexps are built up from expressions, quantifiers, and
 \l {assertions} {assertions}.
* /
You can simplify this as follows:

/ *!
 \target assertions

 Assertions make some statement about the text at the
 point where they occur in the regexp, but they do not
 match any characters.

 ...

 Regexps are built up from expressions, quantifiers, and
 \l assertions.
* /
For the one-parameter version, the braces can often be omitted. The \l command supports several ways of linking:

\l QWidget - The name of a class documented with the \class command.

- \l QWidget::sizeHint() - The signature of a function without parameters. If a matching function without parameters can't be found, the link is satisfied with the first matching function found.

- \l QWidget::removeAction(QAction* action) - The signature of a function with parameters. If an exact match is not found, the link is not satisfied and QDoc reports a Can't link to... error.

- \l <QtGlobal> - The subject of a \headerfile command.

- \l widgets/wiggly - The relative path used in an \example command.

- \l {QWidget Class Reference} - The title used in a \title command.

- \l {Introduction to QDoc}- The text from one of the Section commands.

- \l fontmatching - The argument of a \target command.

- \l {Shared Classes} - A keyword named in a \keyword command.

- \l http://qt-project.org/ - A URL.

QDoc also tries to make a link out of any word that doesn't resemble a normal English word, for example, Qt class names or functions, like QWidget or QWidget::sizeHint(). In these cases, the \l command can actually be omitted, but by using the command, you ensure that QDoc will emit a warning if it cannot find the link target. In addition, if you only want the function name to appear in the link, you can use the following syntax:

- \l {QWidget::} {sizeHint()}

QDoc renders this as:

sizeHint()

### Fixing Ambiguous Links

Because of the modularization of Qt beginning with Qt 5.0, The possibility that QDoc will have to deal with ambiguous links has increased. An ambiguous link is one that has a matching target in more than one Qt module, e.g. the same section title can appear in more than one Qt module, or the name of a C++ class in one module can also be the name of a QML type in another module. A real example in Qt5 is the name Qt itself. Qt is the name of both a C++ namespace in QtCore and a QML type in QtQml.

Suppose we want to link to the Qt C++ namespace. At the time QDoc generated this HTML page, that link was correct. Does it still go to the C++ namespace? Qdoc generated that link from this link command:

- \l {Qt} {Qt C++ namespace}

Now suppose we want to link to the Qt QML type. At the time QDoc generated this HTML page, that link was also correct, but we had to use this link command:

- \l [QML] {Qt} {Qt QML type}

The QML in square brackets tells QDoc to accept a matching target only if the traget is on a QML page. Qdoc actually finds the C++ namespace target first, but since that target is on a C++ page, QDoc ignores it and keeps looking until it finds the same target on a QML page.

Without the guidance in the \l command in the optional square bracket argument, QDoc links to the first matching target it finds. QDoc can't warn that the link was ambiguous in such cases because it doesn't know that another matching target exists.

### What arguments can appear in square brackets?

A link command with square bracket argument has the following syntax:

\l [QML|CPP|DOC|QtModuleName] {link target} {link text}

The square bracket argument is only allowed in the \l (link) command. The example above shows how QML is used as the square brackets argument to force QDoc to match a QML target. Most often, this will be a QML type, but it can also be a QML member function of property.

In the example, QDoc didn't need a square bracket argument to find the Qt C++ namespace page, because that one was the first matching target QDoc found anyway. However, to force QDoc to find a C++ target when a matching QML target gets in the way, CPP can be used as the square bracket argument. For example:

- \l [CPP] {Qt} {Qt C++ namespace}

...will force QDoc to ignore the Qt QML type and continue searching until it matches the Qt C++ namespace.

If the link target is neither a C++ nor a QML entity, DOC can be used as the square bracket argument to prevent QDoc from matching either of those. At this writing, there were no cases of ambiguous links where using DOC was required.

Often, the documentor knows which Qt module the link target is in. When the module name is known, use the module name as the square bracket argument. In the example above, if we know that the QML type named Qt is located in the QtQml module, we can write the link command like this:

- \l [QtQml] {Qt} {Qt QML type}

When a module name is used as the square bracket argument, QDoc will search for link the target in that module only. This makes searching for link targets more efficient.

Finally, the module name and entity type arguments can be combined, separated by a blank, so something like this is also allowed:

- \l [CPP QtQml] {Window} {C++ class Window}

As of this writing, there were no cases where combining the two was required.

See also \sa, \target, and \keyword.

## \sa (see also)

The \sa command defines a list of links that will be rendered in a separate "See also" section at the bottom of the documentation unit.

The command takes a comma-separated list of links as its argument. If the line ends with a comma, you can continue the list on the next line. The general syntax is:

\sa {the first link}, {the second link},
 {the third link}, ...
QDoc will automatically try to generate "See also" links interconnecting a property's various functions. For example, a setVisible() function will automatically get a link to visible() and vice versa.

In general, QDoc will generate "See also" links that interconnect the functions that access the same property. It recognizes four different syntax versions:

- property()

- setProperty()

- isProperty()

- hasProperty()

The \sa command supports the same kind of links as the \l command.

/ *!
 Appends the actions \a actions to this widget's
 list of actions.

 \sa removeAction(), QMenu, addAction()
* /
void QWidget::addActions(QList<QAction *> actions)
{
...
}

QDoc renders this as:

void QWidget::addActions ( QList<QAction*> actions )

Appends the actions actions to this widget's list of actions.

See also removeAction(), QMenu, and addAction().

See also \l, \target and \keyword.

## \target

The \target command names a place in the documentation that you can link to using the \l (link) and \sa (see also) commands.

The text up to the line break becomes the target name. Be sure to follow the target name with a line break. Curly brackets are not required around the target name, but they may be required when the target name is used in a link command. See below.

/ *!
 \target capturing parentheses
 \section1 Capturing Text

 Parentheses allow us to group elements together so that
 we can quantify and capture them.

 ...
* /
The target name capturing parentheses can be linked from within the same document containing the target in the following way:

- \l {capturing parentheses} (from within the same QDoc comment)

Note: The brackets in the link example are required because the target name contains spaces.

See also \l, \sa and \keyword.

## \keyword

The \keyword command names a place in the documentation that you can link to using the \l (link) and \sa (see also) commands.

The \keyword command is like the \target command, except when linking to keyword the link goes to the top of the QDoc comment where the \keyword appears in. If you want to create a link target to a section unit within a \page, use \target instead. A keyword can be linked from anywhere using a simple syntax.

Keywords must be unique over all the documents processed during the QDoc run. The command uses the rest of the line as its argument. Be sure to follow the keyword with a line break.

/ *!
 \class QRegExp
 \reentrant
 \brief The QRegExp class provides pattern
 matching using regular expressions.
 \ingroup tools
 \ingroup misc
 \ingroup shared

 \keyword regular expression

 Regular expressions, or "regexps", provide a way to
 find patterns within text.

 ...
* /
The location marked with the keyword can be linked to with:

/ *!
 When a string is surrounded by slashes, it is
 interpreted as a \l {QRegExp}{regular expression}.
* /
QDoc renders this as:

When a string is surrounded by slashes, it is interpreted as a regular expression.

If the keyword text contains spaces, the brackets are required.

See also \l (link), \sa (see also) and \target.

Including External Code
Including Images

© 2024 The Qt Company Ltd.
 Documentation contributions included herein are the copyrights of
 their respective owners. The documentation provided herein is licensed under the terms of the GNU Free Documentation License version 1.3 as published by the Free Software Foundation. Qt and respective logos are trademarks of The Qt Company Ltd. in Finland and/or other countries
 worldwide. All other trademarks are property of their respective owners. 

 
 
 
 
 Contents
 
 

- \l (link)

- Fixing Ambiguous Links

- What arguments can appear in square brackets?

- \sa (see also)

- \target

- \keyword

 
 
 
 Next
 
 
- Including Images

 
 Previous
 
 
- Including External Code

 
 
 
 
 
 

 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
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

 
 
 
 
 
 


