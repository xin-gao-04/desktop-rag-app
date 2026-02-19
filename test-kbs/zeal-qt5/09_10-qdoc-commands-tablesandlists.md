
 

 
 
 Tables and Lists | QDoc Manual 5.15.18

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
 
- Tables and Lists
 
 
 
 
 
 
 
 

- 

Including Images
Special Content

# Tables and Lists

 
These commands enable creating lists and tables. A list is rendered left aligned as a separate paragraph. A table is rendered centered as a separate paragraph. The table width depends on the width of its contents.

## \table

The \table and \endtable commands delimit the contents of a table.

The command accepts a single argument specifying the table's width as a percentage of the page width:

/ *!
 \table 100 %

 ...

 \endtable
* /
The code above ensures that the table will fill all available space. If the table's width is smaller than 100 %, the table will be centered in the generated documentation.

A table can contain headers, rows and columns. A row starts with a \row command and consists of cells, each of which starts with an \li command. There is also a \header command which is a special kind of row that has a special format.

/ *!
 \table
 \header
 \li Qt Core Feature
 \li Brief Description
 \row
 \li \l {Signal and Slots}
 \li Signals and slots are used for communication
 between objects.
 \row
 \li \l {Layout Management}
 \li The Qt layout system provides a simple
 and powerful way of specifying the layout
 of child widgets.
 \row
 \li \l {Drag and Drop}
 \li Drag and drop provides a simple visual
 mechanism which users can use to transfer
 information between and within applications.
 \endtable
* /
QDoc renders this as:

Qt Core Feature
Brief Description

 Signals and Slots

Signals and slots are used for communication
 between objects.

 Layout Management
The Qt layout system provides a simple
 and powerful way of specifying the layout
 of child widgets.

 Drag and Drop
Drag and drop provides a simple visual
 mechanism which users can use to transfer
 information between and within applications.

You can also make cells span several rows and columns. For example:

/ *!
 \table
 \header
 \li {3,1} This header cell spans three columns,
 but only one row.
 \row
 \li {2, 1} This table cell spans two columns,
 but only one row
 \li {1, 2} This table cell spans only one column,
 but two rows.
 \row
 \li A regular table cell
 \li A regular table cell
 \endtable
* /
QDoc renders this as:

 This header cell spans three columns, but only one row.
 

 This table cell spans two columns, but only one row.
 

 This table cell spans only one column, but two rows.
 

A regular table cell
A regular table cell

See also \header, \row and \li.

## \header

The \header command indicates that the following table cells are the current table's column headers.

The command can only be used within the \table...\endtable commands. A header can contain several cells. A cell is created with the \li command.

A header cell's text is centered within the table cell and rendered using a bold font.

/ *!
 \table
 \header
 \li Qt Core Feature
 \li Brief Description
 \row
 \li \l {Signal and Slots}
 \li Signals and slots are used for communication
 between objects.
 \endtable
* /
QDoc renders this as:

Qt Core Feature
Brief Description

 Signals and Slots

Signals and slots are used for communication
 between objects.

See also \table, \row and \li.

## \row

The \row command begins a new row in a table. The \li items that belong in the new row will immediately follow the \row.

The command can only be used within the \table...\endtable commands. A row can contain several cells. A cell is created with the \li command.

The background cell color of each row alternates between two shades of grey, making it easier to distinguish the rows from each other. The cells' contents is left aligned.

/ *!
 \table
 \header
 \li Qt Core Feature
 \li Brief Description
 \row
 \li \l {Signal and Slots}
 \li Signals and slots are used for communication
 between objects.
 \row
 \li \l {Layout Management}
 \li The Qt layout system provides a simple
 and powerful way of specifying the layout
 of child widgets.
 \row
 \li \l {Drag and Drop}
 \li Drag and drop provides a simple visual
 mechanism which users can use to transfer
 information between and within applications.
 \endtable
* /
QDoc renders this as:

Qt Core Feature
Brief Description

 Signals and Slots

Signals and slots are used for communication
 between objects.

 Layout Management
The Qt layout system provides a simple
 and powerful way of specifying the layout
 of child widgets.

 Drag and Drop
Drag and drop provides a simple visual
 mechanism which users can use to transfer
 information between and within applications.

See also \table, \header, and \li.

## \value

The \value command starts the documentation of a C++ enum item.

The command's first argument is the value name. The value name may be preceded by an optional since clause enclosed in square brackets. The value description follows the value name. The description ends at the next blank line or \value. The arguments are rendered in a table.

Without a since clause, a \value command could look like this:

\value QtInfoMsg A message generated by the qInfo() function.
The same command with a since clause would look like this:

\value [since 5.5] QtInfoMsg A message generated by the qInfo() function.
The documentation will be located in the associated class, header file or namespace documentation. See the \enum documentation for an example.

Note: Since Qt 5.4, \value command can also be used outside the \enum topic. In this case, QDoc renders a two-column table listing the constant name (taken as-is from the first argument) and its description. This can be used, for example, in \qmlproperty topic for documenting acceptable values for a QML enumeration property.

See also \enum and \omitvalue.

## \omitvalue

The \omitvalue command excludes a C++ enum item from the documentation.

The command's only argument is the name of the enum item that will be omitted. See the \enum documentation for an example.

See also \enum and \value \since

## \list

The \list and \endlist commands delimit a list of items.

Create each list item with the \li command. A list always contains one or more items. Lists can be nested. For example:

/ *!
 \list
 \li Qt Reference Documentation: Getting Started
 \list
 \li How to Learn Qt
 \li Installation
 \list
 \li Qt/X11
 \li Qt/Windows
 \li Qt/Mac
 \li Qt/Embedded
 \endlist
 \li Tutorial and Examples
 \endlist
 \endlist
* /
QDoc renders this as:

Qt Reference Documentation: Getting Started
How to Learn Qt

- Installation
Qt/X11

- Qt/Windows

- Qt/Mac

- Qt/Embedded

- Tutorial and Examples

The \list command takes an optional argument providing alternative appearances for the list items.

/ *!
 \list
 \li How to Learn Qt
 \li Installation
 \li Tutorial and Examples
 \endlist
* /
QDoc renders the list items with bullets (the default):

- How to Learn Qt

- Installation

- Tutorial and Examples

If you provide 'A' as an argument to the \list command, the bullets are replaced with characters in alphabetical order:

- How to Learn Qt

- Installation

- Tutorial and Examples

If you replace 'A' with '1', the list items are numbered in ascending order:

- How to Learn Qt

- Installation

- Tutorial and Examples

If you provide 'i' as the argument, the bullets are replaced with roman numerals:

- How to Learn Qt

- Installation

- Tutorial and Examples

Finally, you can make the list items appear with roman numbers following in ascending order if you provide 'I' as the optional argument:

- How to Learn Qt

- Installation

- Tutorial and Examples

You can also make the listing start at any character or number by simply provide the number or character you want to start at. For example:

/ *!
 \list G
 \li How to Learn Qt
 \li Installation
 \li Tutorial and Examples
 \endlist
* /
QDoc renders this as:

- How to Learn Qt

- Installation

- Tutorial and Examples

See also \li.

## \li (table cell, list item)

The \li command marks a table cell or a list item. This command is only used in tables and lists.

It considers everything as its argument until the next \li command, until the next \endtable, or \endlist command. See \table and \list for examples.

If the command is used within a table, you can also specify how many rows or columns the item should span.

/ *!
 \table
 \header
 \li {3,1} This header cell spans three columns
 but only one row.
 \row
 \li {2, 1} This table item spans two columns
 but only one row
 \li {1, 2} This table item spans only one column,
 but two rows.
 \row
 \li A regular table item
 \li A regular table item
 \endtable
* /
QDoc renders this as:

 This header cell spans three columns, but only one row.
 

 This table item spans two columns, but only one row.
 

 This table item spans only one column, but two rows.
 

A regular table item
A regular table item

If not specified, the item will span one column and one row.

See also \table, \header, and \list.

Including Images
Special Content

© 2024 The Qt Company Ltd.
 Documentation contributions included herein are the copyrights of
 their respective owners. The documentation provided herein is licensed under the terms of the GNU Free Documentation License version 1.3 as published by the Free Software Foundation. Qt and respective logos are trademarks of The Qt Company Ltd. in Finland and/or other countries
 worldwide. All other trademarks are property of their respective owners. 

 
 
 
 
 Contents
 
 

- \table

- \header

- \row

- \value

- \omitvalue

- \list

- \li (table cell, list item)

 
 
 
 Next
 
 
- Special Content

 
 Previous
 
 
- Including Images

 
 
 
 
 
 

 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
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

 
 
 
 
 
 


