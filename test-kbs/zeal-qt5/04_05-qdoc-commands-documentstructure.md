
 

 
 
 Document Structure | QDoc Manual 5.15.18

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
 
- Document Structure
 
 
 
 
 
 
 
 

- 

Text Markup
Including Code Inline

# Document Structure

 
The document structuring commands are for dividing your document into sections. QDoc supports four levels of section: \section1, \section2, \section3, and \section4. The section commands correspond to the traditional section, subsection, etc used in outlining.

## Section commands

In general a document structuring command considers everything that follows it until the first line break as its argument. The argument is rendered as the unit's title. If the title needs to be spanned over several lines, make sure that each line (except the last one) is ended with a backslash.

In total, there are four levels for sections in QDoc: \section1, \section2, \section3 and \section4. These correspond to the traditional section, subsection, subsubsection and subsubsubsection.

There is a strict ordering of the section units:

section1
 |
 section2
 |
 section3
 |
 section4
When sections are used, the first section command should be section1.

/ *!
 \section1 Basic Qt

 This is the first section.

 \section2 Getting Started

 This is the first subsection.

 \section3 Hello Qt

 This is the first subsubsection.

 \section3 Making Connections

 This is the second subsubsection.

 \section3 Using the Reference Documentation

 This is the third subsubsection.

 \section2 Creating Dialogs

 This is the second subsection.

 \section3 Subclassing QDialog

 This is the first subsubsection.

 ...

 \section1 Intermediate Qt

 This is the second section.

 \section2 Layout Management

 This is the second section's first subsection.

 \section3 Basic Layouts

 This is the first subsubsection.

 ...
* /

QDoc renders this as:

 

# Basic Qt

This is the first section.

## Getting Started

 This is the first subsection.

 

### Hello Qt

This is the first subsubsection.

### Making Connections

This is the second subsubsection.

### Using the Reference Documentation

This is the third subsubsection.

## Creating Dialogs

This is the second subsection.

### Subclassing QDialog

This is the first subsubsection.

 ...

 

# Intermediate Qt

This is the second section.

## Layout Management

This is the second section's first subsection.

### Basic Layouts

This is the first subsubsection.

 ...

 
Each section is a logical unit in the document. The section heading appears in the automatically generated table of contents that normally appears in the upper right-hand corner of the page.

## \section1

The \section1 command starts a new section.

See Section commands for an explanation of the various section units, command argument, and rendering.

## \section2

The \section2 command starts a new section.

See Section commands for an explanation of the various section units, command argument, and rendering.

## \section3

The \section3 command starts a new section.

See Section commands for an explanation of the various section units, command argument, and rendering.

## \section4

The \section4 command starts a new section.

See Section commands for an explanation of the various section units, command argument, and rendering.

Text Markup
Including Code Inline

© 2024 The Qt Company Ltd.
 Documentation contributions included herein are the copyrights of
 their respective owners. The documentation provided herein is licensed under the terms of the GNU Free Documentation License version 1.3 as published by the Free Software Foundation. Qt and respective logos are trademarks of The Qt Company Ltd. in Finland and/or other countries
 worldwide. All other trademarks are property of their respective owners. 

 
 
 
 
 Contents
 
 
Section commands

- \section1

- \section2

- \section3

- \section4

 
 
 
 Next
 
 
- Including Code Inline

 
 Previous
 
 
- Text Markup

 
 
 
 
 
 

 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
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

 
 
 
 
 
 


