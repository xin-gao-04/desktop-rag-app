
 

 
 
 Special Content | QDoc Manual 5.15.18

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
 
- Special Content
 
 
 
 
 
 
 
 

- 

Tables and Lists
Miscellaneous

# Special Content

 
The document contents commands identify parts of the documentation, parts with a special rendering, conceptual meaning or function.

## \quotation

The \quotation and \endquotation commands delimit a long quotation.

The text in the delimited block is surrounded by <blockquote> and </blockquote> in the html output, e.g.:

/ *!
 Although the prospect of a significantly broader market is
 good news for Firstlogic, the notion also posed some
 challenges. Dave Dobson, director of technology for the La
 Crosse, Wisconsin-based company, said:

 \quotation
 As our solutions were being adopted into new
 environments, we saw an escalating need for easier
 integration with a wider range of enterprise
 applications.
 \endquotation
* /
The text in the \quotation block will appear in the generated HTML as:

<blockquote>
 <p>As our solutions were being adopted into new environments,
 we saw an escalating need for easier integration with a wider
 range of enterprise applications.</p>
 </blockquote>
The built-in style sheet for most browsers will render the contents of the <blockquote> tag with left and right indentations. The example above would be rendered as:

As our solutions were being adopted into new environments, we saw an escalating need for easier integration with a wider range of enterprise applications.

But you can redefine the <blockquote> tag in your style.css file.

## \footnote

The \footnote and \endfootnote commands delimit a footnote.

The footnote is rendered at the bottom of the page.

Warning: The \footnote and \endfootnote commands have not been implemented. The footnote is rendered as a regular HTML paragraph.

## \note

The \note command defines a new paragraph preceded by "Note:" in bold.

## \tableofcontents

The \tableofcontents command has been disabled because QDoc now generates a table of contents automatically.

The automatically generated table of contents appears in the upper righthand corner of the page.

## \brief

The \brief command introduces a one-sentence description of a class, namespace, header file, property, or variable.

The brief text is used to introduce the documentation of the associated object, and in lists generated using the \generatelist command and the \annotatedlist command.

The \brief command can be used in two significant different ways: One for classes, namespaces and header files, and one for properties and variables.

When the \brief command is used to describe a property or a variable, the brief text must be a sentence fragment starting with "whether" (for a boolean property or variable) or starting with "the" (for any other property or variable).

For example the boolean QWidget::isWindow property:

/ *!
 \property QWidget::isActiveWindow
 \brief Whether this widget's window is the active window.

 The active window is the window that contains the widget that
 has keyboard focus.

 When popup windows are visible, this property is \c true
 for both the active window \e and the popup.

 \sa activateWindow(), QApplication::activeWindow()
* /

and the QWidget::geometry property

/ *!
 \property QWidget::geometry
 \brief The geometry of the widget relative to its parent and
 excluding the window frame.

 When changing the geometry, the widget, if visible,
 receives a move event (moveEvent()) and/or a resize
 event (resizeEvent()) immediately.

 ...

 \sa frameGeometry(), rect(), ...
* /
QDoc renders this as:

 
### geometry :
 QRect

This property holds the geometry of the widget relative to its parent and excluding the window frame.

...

Access functions:

const QRect & geometry () const

- void setGeometry ( int x, int y, int w, int h )

- void setGeometry ( const QRect & )

See also frameGeometry(), rect(), ...

When the \brief command is used to describe a class, we recommend using a complete sentence like this:

The <classname> class is|provides|contains|specifies...

Warning: Do not repeat your detailed description with the same sentence as the brief statement will be the first paragraph of the detailed description.

/ *!
 \class PreviewWindow
 \brief The PreviewWindow class is a custom widget
 displaying the names of its currently set
 window flags in a read-only text editor.

 The PreviewWindow class inherits QWidget. The widget
 displays the names of its window flags set with the
 setWindowFlags() function. It is also provided with a
 QPushButton that closes the window.

 ...

 \sa QWidget
* /
QDoc renders this as:

 
# PreviewWindow Class Reference

The PreviewWindow class is a custom widget displaying the names of its currently set window flags in a read-only text editor. More...

### Properties

- 52 properties inherited from QWidget

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

Using \brief in a \namespace:

/ *!
 \namespace Qt

 \brief The Qt namespace contains miscellaneous identifiers
 used throughout the Qt library.
* /
Using \brief in a \headerfile:

/ *!
 \headerfile <QtGlobal>
 \title Global Qt Declarations

 \brief The <QtGlobal> header file provides basic
 declarations and is included by all other Qt headers.

 \sa <QtAlgorithms>
* /
See also \property, \class, \namespace and \headerfile.

## \legalese

The \legalese and \endlegalese commands delimit a license agreement.

In the generated HTML, the delimited text is surrounded by a <div class="LegaleseLeft"> and </div> tags.

An example of a license agreement enclosed in \legalese and \endlegalese:

/ *!
 \legalese
 Copyright 1996 Daniel Dardailler.

 Permission to use, copy, modify, distribute, and sell this
 software for any purpose is hereby granted without fee,
 provided that the above copyright notice appear in all
 copies and that both that copyright notice and this
 permission notice appear in supporting documentation, and
 that the name of Daniel Dardailler not be used in
 advertising or publicity pertaining to distribution of the
 software without specific, written prior permission. Daniel
 Dardailler makes no representations about the suitability of
 this software for any purpose. It is provided "as is"
 without express or implied warranty.

 Modifications Copyright 1999 Matt Koss, under the same
 license as above.
 \endlegalese
 * /
It will appear in the generated HTML as:

<div class="LegaleseLeft">
 <p>Copyright 1996 Daniel Dardailler.</p>
 <p>Permission to use, copy, modify, distribute, and sell
 this software for any purpose is hereby granted without fee,
 provided that the above copyright notice appear in all
 copies and that both that copyright notice and this
 permission notice appear in supporting documentation, and
 that the name of Daniel Dardailler not be used in
 advertising or publicity pertaining to distribution of the
 software without specific, written prior permission. Daniel
 Dardailler makes no representations about the suitability of
 this software for any purpose. It is provided "as is"
 without express or implied warranty.</p>

 <p>Modifications Copyright 1999 Matt Koss, under the same
 license as above.</p>
</div>
If the \endlegalese command is omitted, QDoc will process the \legalese command but considers the rest of the documentation page as the license agreement.

Ideally, the license text is located with the licensed code.

Elsewhere, the documentation identified as \legalese command can be accumulated using \generatelist with legalese as the argument. This is useful for generating an overview of the license agreements associated with the source code.

Note: The output of the \generatelist legalese command includes the \legalese texts in the current documentation project only. If the current documentation project depends on other modules, their license texts will not be listed.

## \warning

The \warning command prepends "Warning:" to the command's argument, in bold font.

/ *!
 Qt::HANDLE is a platform-specific handle type
 for system objects. This is equivalent to
 \c{void *} on Windows and macOS, and to
 \c{unsigned long} on X11.

 \warning Using this type is not portable.
* /
QDoc renders this as:

Qt::HANDLE is a platform-specific handle type for system objects. This is equivalent to void * on Windows and macOS, and to unsigned long on X11.

Warning: Using this type is not portable.

Tables and Lists
Miscellaneous

© 2024 The Qt Company Ltd.
 Documentation contributions included herein are the copyrights of
 their respective owners. The documentation provided herein is licensed under the terms of the GNU Free Documentation License version 1.3 as published by the Free Software Foundation. Qt and respective logos are trademarks of The Qt Company Ltd. in Finland and/or other countries
 worldwide. All other trademarks are property of their respective owners. 

 
 
 
 
 Contents
 
 

- \quotation

- \footnote

- \note

- \tableofcontents

- \brief

- \legalese

- \warning

 
 
 
 Next
 
 
- Miscellaneous

 
 Previous
 
 
- Tables and Lists

 
 
 
 
 
 

 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
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

 
 
 
 
 
 


