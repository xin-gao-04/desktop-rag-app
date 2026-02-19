
 

 
 
 Including Code Inline | QDoc Manual 5.15.18

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
 
- Including Code Inline
 
 
 
 
 
 
 
 

- 

Document Structure
Including External Code

# Including Code Inline

 
The following commands are used to render source code without formatting. The source code begins on a new line, rendered in the code.

Note: Although most of these commands are for rendering C++ code, the \snippet and \codeline commands are preferred over the others. These commands allow equivalent code snippets for other Qt language bindings to be substituted for the C++ snippets in the documentation.

## \code

The \code and \endcode commands enclose a snippet of source code.

Note: The \c command can be used for short code fragments within a sentence. The \code command is for longer code snippets. It renders the code verbatim in a separate paragraph in a html <pre> element, and parses the enclosed snippet, creating links to any known types in the code.

For documenting command-line instructions, shell scripts, or any content that is not in a Qt language recognized by QDoc, use \badcode instead.

When processing any of the \code, \newcode or \oldcode commands, QDoc removes all indentation that is common for the verbatim code blocks within a /*! ... */ comment before it adds the standard indentation.

Note: This doesn't apply to externally quoted code using the \quotefromfile or \quotefile command.

/ *!
 \code
 #include <QApplication>
 #include <QPushButton>

 int main(int argc, char *argv[])
 {
 ...
 }
 \ endcode
* /
QDoc renders this as:

#include <QApplication>
#include <QPushButton>

int main(int argc, char *argv[])
{
 ...
}
Other QDoc commands are disabled within \code... \endcode, and the special character '\' is accepted and rendered like the rest of the code, unless it is followed by a digit and parameters were passed to \code.

### Code snippet parameters

Since QDoc version 5.12, \code command accepts also optional parameters. Parameters are useful for injecting simple strings into the code snippet. To inject a string to a specific location in the snippet, add a backslash followed by a digit (1..8). The digits correspond with the order of the argument list, where arguments are separated by spaces.

For example:

/ *!
\code * hello
/\1 \2 \1/
\ endcode
* /
For the above snippet, QDoc renders the word hello enclosed in a C-style comment.

### Including code from external files

To include code snippets from an external file, use the \snippet and \codeline commands.

See also \c, \badcode, \quotefromfile, \newcode, and \oldcode.

## \badcode

Similar to \code, \badcode and \endcode commands enclose content that is rendered verbatim in a separate paragraph, but no parsing or automatic link creation is performed. Instead, the content is treated as plain text.

Substitute \code with this command when documenting command-line instructions, shell scripts or any other content that is not in a Qt language, but should still be styled similarly to a \code paragraph.

Like \code, \badcode accepts also optional parameters.

## \newcode

The \newcode, \oldcode, and \endcode commands enable you to show how to port a snippet of code to a new version of an API.

The \newcode command and its companion the \oldcode command are a convenience combination of the \code commands: this combination provides a text relating the two code snippets to each other.

The \newcode command requires a preceding \oldcode statement.

Like the \code command, the \newcode command renders its code on a new line in the documentation using a monospace font and the standard indentation.

/ *!
 \oldcode
 if (printer->setup(parent))
 ...
 \newcode
 QPrintDialog dialog(printer, parent);
 if (dialog.exec())
 ...
 \ endcode
* /
QDoc renders this as:

For example, if you have code like

if (printer->setup(parent))
 ...
you can rewrite it as

QPrintDialog dialog(printer, parent);
 if (dialog.exec())
 ...

Other QDoc commands are disabled within \oldcode ... \endcode, and the '\' character doesn't need to be escaped.

## \oldcode

The \oldcode command requires a corresponding \newcode statement; otherwise QDoc fails to parse the command and emits a warning.

See also \newcode.

## \qml

The \qml and \endqml commands enclose a snippet of QML source code.

/ *!
 \qml
 import QtQuick 2.0

 Row {
 Rectangle {
 width: 100; height: 100
 color: "blue"
 transform: Translate { y: 20 }
 }
 Rectangle {
 width: 100; height: 100
 color: "red"
 transform: Translate { y: -20 }
 }
 }
 \endqml
* /
QDoc renders this as:

import QtQuick 2.0

Row {
 Rectangle {
 width: 100; height: 100
 color: "blue"
 transform: Translate { y: 20 }
 }
 Rectangle {
 width: 100; height: 100
 color: "red"
 transform: Translate { y: -20 }
 }
}
Like the \code command, \qml accepts optional parameters.

Document Structure
Including External Code

© 2024 The Qt Company Ltd.
 Documentation contributions included herein are the copyrights of
 their respective owners. The documentation provided herein is licensed under the terms of the GNU Free Documentation License version 1.3 as published by the Free Software Foundation. Qt and respective logos are trademarks of The Qt Company Ltd. in Finland and/or other countries
 worldwide. All other trademarks are property of their respective owners. 

 
 
 
 
 Contents
 
 
\code

- Code snippet parameters

- Including code from external files

- \badcode

- \newcode

- \oldcode

- \qml

 
 
 
 Next
 
 
- Including External Code

 
 Previous
 
 
- Document Structure

 
 
 
 
 
 

 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
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

 
 
 
 
 
 


