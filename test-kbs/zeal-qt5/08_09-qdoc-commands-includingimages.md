
 

 
 
 Including Images | QDoc Manual 5.15.18

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
 
- Including Images
 
 
 
 
 
 
 
 

- 

Creating Links
Tables and Lists

# Including Images

 
The graphic commands makes it possible to include images in the documentation. The images can be rendered as separate paragraphs, or within running text.

## \image

The \image command expands to the image specified by its first argument, and renders it centered as a separate paragraph.

The command takes two arguments. The first argument is the name of the image file. The second argument is optional and is a simple description of the image, equivalent to the HTML alt="" in an image tag. The description is used for tooltips and for browsers that don't support images, like the Lynx text browser.

The remaining text after the file name is the optional, description argument. Be sure to follow the file name or the description with a line break. Curly brackets are required if the description argument spans multiple lines.

/ *!
 Qt is a C++ toolkit for cross-platform GUI application development.

 \image happyguy.jpg "Happy guy"

 Qt provides single-source portability across Microsoft
 Windows, macOS, Linux, and all major commercial Unix
 variants. It is also available for embedded devices.
* /
QDoc renders this as:

Qt is a C++ toolkit for cross-platform GUI application development.

Qt provides single-source portability across Microsoft Windows, macOS, Linux, and all major commercial Unix variants. It is also available for embedded devices.

See also \inlineimage and \caption.

## \inlineimage

The \inlineimage command expands to the image specified by its argument. The image is rendered inline with the rest of the text.

The command takes two arguments. The first argument is the name of the image file. The second argument is optional and is a simple description of the image, equivalent to the HTML alt="" in an image tag. The description is used for tooltips, and for when a browser doesn't support images, like the Lynx text browser.

The most common use of the \inlineimage command is in lists and tables. Here is an example of including inline images in a list:

/ *!
 \list 1
 \li \inlineimage happy.gif Oh so happy!
 \li \inlineimage happy.gif Oh so happy!
 \li \inlineimage happy.gif Oh so happy!
 \endlist
* /
QDoc renders this as:

- 

- 

Here is an example of including inline images in a table:

/ *!
 \table
 \header
 \li Qt
 \li Qt Creator
 \row
 \li \inlineimage happy.gif Oh so happy!
 \li \inlineimage happy.gif Oh so happy!
 \row
 \li \inlineimage happy.gif Oh so happy!
 \li \inlineimage happy.gif Oh so happy!
 \endtable
* /
QDoc renders this as:

Qt
Qt Creator

The command can also be used to insert an image inline with the text.

/ *!
 \inlineimage training.jpg Qt Training
 The Qt Programming course is offered as a
 five day Open Enrollment Course. The classes
 are open to the public. Although the course is open
 to anyone who wants to learn, attendees should
 have significant experience in C++ development
 to derive maximum benefit from the course.
* /
QDoc renders this as:

 The Qt Programming course is offered as a five day Open Enrollment Course. The classes are open to the public. Although the course is open to anyone who wants to learn, attendees should have significant experience in C++ development to derive maximum benefit from the course.

See also \image and \caption.

## \caption

The \caption command provides a caption for an image.

The command takes all the text up to the end of the paragraph to be the caption. Experiment until you get the effect you want.

/ *!
 \table 100%
 \row
 \li \image windowsvista-pushbutton.png
 \caption The QPushButton widget provides a command button.
 \li \image windowsvista-toolbutton.png
 \caption The QToolButton class provides a quick-access button to commands
 or options, usually used inside a QToolBar.
 \endtable
* /
QDoc renders this as:

The QPushButton widget provides a command button.

The QToolButton class provides a quick-access button to commands or options, usually used inside a QToolBar.

See also \image and \inlineimage

Creating Links
Tables and Lists

© 2024 The Qt Company Ltd.
 Documentation contributions included herein are the copyrights of
 their respective owners. The documentation provided herein is licensed under the terms of the GNU Free Documentation License version 1.3 as published by the Free Software Foundation. Qt and respective logos are trademarks of The Qt Company Ltd. in Finland and/or other countries
 worldwide. All other trademarks are property of their respective owners. 

 
 
 
 
 Contents
 
 

- \image

- \inlineimage

- \caption

 
 
 
 Next
 
 
- Tables and Lists

 
 Previous
 
 
- Creating Links

 
 
 
 
 
 

 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
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

 
 
 
 
 
 


