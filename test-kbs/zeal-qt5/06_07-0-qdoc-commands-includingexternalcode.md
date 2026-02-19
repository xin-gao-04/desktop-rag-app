
 

 
 
 Including External Code | QDoc Manual 5.15.18

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
 
- Including External Code
 
 
 
 
 
 
 
 

- 

Including Code Inline
Creating Links

# Including External Code

 
The following commands enable you to include code snippets from external files. You can make QDoc include the complete contents of a file, or you can quote specific parts of the file and skip others. The typical use of the latter is to quote a file chunk by chunk.

Note: Although all these commands can be used for rendering C++ code, the \snippet and \codeline commands are preferred over the others. These commands allow equivalent code snippets for other Qt language bindings to be substituted for the C++ snippets in the documentation.

## \quotefile

The \quotefile command expands to the complete contents of the file given as argument.

The command considers the rest of the line as part of its argument, make sure to follow the file name with a line break.

The file's contents is rendered in a separate paragraph, using a monospace font and the standard indentation. The code is shown verbatim.

/ *!
 This is a simple "Hello world" example:

 \quotefile examples/main.cpp

 It contains only the bare minimum you need
 to get a Qt application up and running.
* /
QDoc renders this as:

This is a simple "Hello world" example:

/****************************************************************************
**
** Copyright (C) 2016 The Qt Company Ltd.
** Contact: https://www.qt.io/licensing/
**
** This file is part of the tools applications of the Qt Toolkit.
**
** $QT_BEGIN_LICENSE:GPL-EXCEPT$
** Commercial License Usage
** Licensees holding valid commercial Qt licenses may use this file in
** accordance with the commercial license agreement provided with the
** Software or, alternatively, in accordance with the terms contained in
** a written agreement between you and The Qt Company. For licensing terms
** and conditions see https://www.qt.io/terms-conditions. For further
** information use the contact form at https://www.qt.io/contact-us.
**
** GNU General Public License Usage
** Alternatively, this file may be used under the terms of the GNU
** General Public License version 3 as published by the Free Software
** Foundation with exceptions as appearing in the file LICENSE.GPL3-EXCEPT
** included in the packaging of this file. Please review the following
** information to ensure the GNU General Public License requirements will
** be met: https://www.gnu.org/licenses/gpl-3.0.html.
**
** $QT_END_LICENSE$
**
****************************************************************************/

#include <QApplication>
#include <QPushButton>

int main(int argc, char *argv[])
{
 QApplication app(argc, argv);

 QPushButton hello("Hello world!");
 hello.resize(100, 30);

 hello.show();
 return app.exec();
}
It contains only the bare minimum you need to get a Qt application up and running.

See also \quotefromfile and \code.

## \quotefromfile

The \quotefromfile command opens the file given as argument for quoting.

The command considers the rest of the line as part of its argument, make sure to follow the file name with a line break.

The command is intended for use when quoting parts from file with the walkthrough commands: \printline, \printto, \printuntil, \skipline, \skipto, \skipuntil. This enables you to quote specific portions of a file.

/ *!
 The whole application is contained within
 the \c main() function:

 \quotefromfile examples/main.cpp

 \skipto main
 \printuntil app(argc, argv)

 First we create a QApplication object using
 the \c argc and \c argv parameters.

 \skipto QPushButton
 \printuntil resize

 Then we create a QPushButton, and give it a reasonable
 size using the QWidget::resize() function.

 ...
* /
QDoc renders this as:

The whole application is contained within the main() function:

int main(int argc, char *argv[])
{
 QApplication app(argc, argv);
First we create a QApplication object using the argc and argv parameters.

 QPushButton hello("Hello world!");
 hello.resize(100, 30);
Then we create a QPushButton, and give it a reasonable size using the QWidget::resize() function.

...

QDoc remembers which file it is quoting from, and the current position in that file (see \printline for more information). There is no need to "close" the file.

See also \quotefile, \code and \dots.

## \printline

The \printline command expands to the line from the current position to the next non-blank line of the current source file.

To ensure that the documentation remains synchronized with the source file, a substring of the line must be specified as an argument to the command. Note that the command considers the rest of the line as part of its argument, make sure to follow the substring with a line break.

The line from the source file is rendered as a separate paragraph, using a monospace font and the standard indentation. The code is shown verbatim.

/ *!
 There has to be exactly one QApplication object
 in every GUI application that uses Qt.

 \quotefromfile examples/main.cpp

 \printline QApplication

 This line includes the QApplication class
 definition. QApplication manages various
 application-wide resources, such as the
 default font and cursor.

 \printline QPushButton

 This line includes the QPushButton class
 definition. The QPushButton widget provides a command
 button.

 \printline main

 The main function...
* /
QDoc renders this as:

There has to be exactly one QApplication object in every GUI application that uses Qt.

#include <QApplication>
This line includes the QApplication class definition. QApplication manages various application-wide resources, such as the default font and cursor.

#include <QPushButton>
This line includes the QPushButton class definition. The QPushButton widget provides a command button.

int main(int argc, char *argv[])
The main function...

QDoc reads the file sequentially. To move the current position forward you can use either of the \skip... commands. To move the current position backward, you can use the \quotefromfile command again.

If the substring argument is surrounded by slashes it is interpreted as a regular expression.

/ *!
 \quotefromfile examples/mainwindow.cpp

 \skipto closeEvent
 \printuntil /^\}/

 Close events are sent to widgets that the users want to
 close, usually by clicking \c File|Exit or by clicking
 the \c X title bar button. By reimplementing the event
 handler, we can intercept attempts to close the
 application.
* /
QDoc renders this as:

void MainWindow::closeEvent(QCloseEvent *event)
//! [1] //! [2]
{
 if (maybeSave()) {
 event->accept();
 } else {
 event->ignore();
 }
}
Close events are sent to widgets that the users want to close, usually by clicking File|Exit or by clicking the X title bar button. By reimplementing the event handler, we can intercept attempts to close the application.

(The complete example file...)

The regular expression /^\}/ makes QDoc print until the first '}' character occurring at the beginning of the line without indentation. /.../ encloses the regular expression, and '^' means the beginning of the line. The '}' character must be escaped since it is a special character in regular expressions.

QDoc will emit a warning if the specified substring or regular expression cannot be located, i.e. if the source code has changed.

See also \printto and \printuntil.

## \printto

The \printto command expands to all the lines from the current position up to and excluding the next line containing a given substring.

The command considers the rest of the line as part of its argument, make sure to follow the substring with a line break. The command also follows the same conventions for positioning and argument as the \printline command.

The lines from the source file are rendered in a separate paragraph, using a monospace font and the standard indentation. The code is shown verbatim.

/ *!
 The whole application is contained within the
 \c main() function:

 \quotefromfile examples/main.cpp
 \printto hello

 First we create a QApplication object using the \c argc and
 \c argv parameters...
* /
QDoc renders this as:

The whole application is contained within the main() function:

int main(int argc, char *argv[])
{
 QApplication app(argc, argv);
First we create a QApplication object using the argc and argv parameters...

See also \printline and \printuntil.

## \printuntil

The \printuntil command expands to all the lines from the current position up to and including the next line containing a given substring.

The command considers the rest of the line as part of its argument, make sure to follow the substring with a line break. The command also follows the same conventions for positioning and argument as the \printline command.

If \printuntil is used without an argument, it expands to all the lines from the current position to the end of the quoted file.

The lines from the source file are rendered in a separate paragraph, using a monospace font and the standard indentation. The code is shown verbatim.

/ *!
 The whole application is contained within the
 \c main() function:

 \quotefromfile examples/main.cpp
 \skipto main
 \printuntil hello

 First we create a QApplication object using the
 \c argc and \c argv parameters, then we create
 a QPushButton.
* /
QDoc renders this as:

The whole application is contained within the main() function:

int main(int argc, char *argv[])
{
 QApplication app(argc, argv);

 QPushButton hello("Hello world!");
First we create a QApplication object using the argc and argv parameters, then we create a QPushButton.

See also \printline and \printto.

## \skipline

The \skipline command ignores the next non-blank line in the current source file.

Doc reads the file sequentially, and the \skipline command is used to move the current position (omitting a line of the source file). See the remark about file positioning above.

The command considers the rest of the line as part of its argument, make sure to follow the substring with a line break. The command also follows the same conventions for argument as the \printline command, and it is used in conjunction with the \quotefromfile command.

/ *!
 QPushButton is a GUI push button that the user
 can press and release.

 \quotefromfile examples/main.cpp
 \skipline QApplication
 \printline QPushButton

 This line includes the QPushButton class
 definition. For each class that is part of the
 public Qt API, there exists a header file of
 the same name that contains its definition.
* /
QDoc renders this as:

QPushButton is a GUI push button that the user can press and release.

#include <QPushButton>
This line includes the QPushButton class definition. For each class that is part of the public Qt API, there exists a header file of the same name that contains its definition.

See also \skipto, \skipuntil and \dots.

## \skipto

The \skipto command ignores all the lines from the current position up to and excluding the next line containing a given substring.

QDoc reads the file sequentially, and the \skipto command is used to move the current position (omitting one or several lines of the source file). See the remark about file positioning above.

The command considers the rest of the line as part of its argument, make sure to follow the substring with a line break.

The command also follows the same conventions for argument as the \printline command, and it is used in conjunction with the \quotefromfile command.

/ *!
 The whole application is contained within
 the \c main() function:

 \quotefromfile examples/main.cpp
 \skipto main
 \printuntil }

 First we create a QApplication object. There
 has to be exactly one such object in
 every GUI application that uses Qt. Then
 we create a QPushButton, resize it to a reasonable
 size...
* /
QDoc renders this as:

The whole application is contained within the main() function:

int main(int argc, char *argv[])
{
 QApplication app(argc, argv);

 QPushButton hello("Hello world!");
 hello.resize(100, 30);

 hello.show();
 return app.exec();
}
First we create a QApplication object. There has to be exactly one such object in every GUI application that uses Qt. Then we create a QPushButton, resize it to a reasonable size ...

See also \skipline, \skipuntil and \dots.

## \skipuntil

The \skipuntil command ignores all the lines from the current position up to and including the next line containing a given substring.

QDoc reads the file sequentially, and the \skipuntil command is used to move the current position (omitting one or several lines of the source file). See the remark about file positioning above.

The command considers the rest of the line as part of its argument, make sure to follow the substring with a line break.

The command also follows the same conventions for argument as the \printline command, and it is used in conjunction with the \quotefromfile command.

/ *!
 The first thing we did in the \c main() function
 was to create a QApplication object \c app.

 \quotefromfile examples/main.cpp
 \skipuntil show
 \dots
 \printuntil }

 In the end we must remember to make \c main() pass the
 control to Qt. QCoreApplication::exec() will return when
 the application exits...
* /
QDoc renders this as:

The first thing we did in the main() function was to create a QApplication object app.

 ...
 return app.exec();
}
In the end we must remember to make main() pass the control to Qt. QCoreApplication::exec() will return when the application exits...

See also \skipline, \skipto and \dots.

## \dots

The \dots command indicates that parts of the source file have been omitted when quoting a file.

The command is used in conjunction with the \quotefromfile command, and should be stated on its own line. The dots are rendered on a new line, using a monospace font.

/ *!
 \quotefromfile examples/main.cpp
 \skipto main
 \printuntil {
 \dots
 \skipuntil exec
 \printline }
* /
QDoc renders this as:

int main(int argc, char *argv[])
{
 ...
}
The default indentation is 4 spaces, but this can be adjusted using the command's optional argument.

/ *!
 \dots 0
 \dots
 \dots 8
 \dots 12
 \dots 16
* /
QDoc renders this as:

...
 ...
 ...
 ...
 ...
See also \skipline, \skipto and \skipuntil.

## \snippet

The \snippet command causes a code snippet to be included verbatim as preformatted text, which may be syntax highlighted.

Each code snippet is referenced by the file that holds it and by a unique identifier for that file. Snippet files are typically stored in a snippets directory inside the documentation directory (for example, $QTDIR/doc/src/snippets).

For example, the following documentation references a snippet in a file residing in a subdirectory of the documentation directory:

\snippet snippets/textdocument-resources/main.cpp Adding a resource
The text following the file name is the unique identifier for the snippet. This is used to delimit the quoted code in the relevant snippet file, as shown in the following example that corresponds to the above \snippet command:

 ...
 QImage image(64, 64, QImage::Format_RGB32);
 image.fill(qRgb(255, 160, 128));

//! [Adding a resource]
 document->addResource(QTextDocument::ImageResource,
 QUrl("mydata://image.png"), QVariant(image));
//! [Adding a resource]
 ...
By default, QDoc looks for //! as a code snippet marker. For .pro, .py, .cmake, and CMakeLists.txt files, #! is detected. Finally, <!-- is accepted in .html, .qrc, .ui, .xml, .dita, and .xq files.

## \codeline

The \codeline command inserts a blank line of preformatted text. It is used to insert gaps between snippets without closing the current preformatted text area and opening a new one.

Including Code Inline
Creating Links

© 2024 The Qt Company Ltd.
 Documentation contributions included herein are the copyrights of
 their respective owners. The documentation provided herein is licensed under the terms of the GNU Free Documentation License version 1.3 as published by the Free Software Foundation. Qt and respective logos are trademarks of The Qt Company Ltd. in Finland and/or other countries
 worldwide. All other trademarks are property of their respective owners. 

 
 
 
 
 Contents
 
 
\quotefile

- \quotefromfile

- \printline

- \printto

- \printuntil

- \skipline

- \skipto

- \skipuntil

- \dots

- \snippet

- \codeline

 
 
 
 Next
 
 
- Creating Links

 
 Previous
 
 
- Including Code Inline

 
 
 
 
 
 

 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
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

 
 
 
 
 
 


