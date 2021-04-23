# historical-transportation-map
Historical Transportation Map of the Boston Region.

This project, Mapping Major Transportation Infrastructure, is funded by Boston Region MPO UPWP project #13307 for Federal Fiscal Year 2021.

* Project Manager: Ken Dumas
* Principal Developer: Ben Krepp

## Technical Overview
The Historical Transportation Map of the Boston Region is an interactive graphics application that displays
major changes to the transportation infrastructure in the Boston region between 1800 and the present (2021.)
It is important to note that it is a _graphics application_, not a _GIS_ application. 
That is to say, the application is an interactive / animated on-line presentation of material that was
previously presented in a large PDF wall poster. 
Moving to on-line, interactive delivery allows the informaiton presented to be updated at-will, 
and for new "editions of the poster" to be published very quickly - all without incurring the costs
associated with physical publication and delivery.

## Data Sources
The data sources for this application are:
1. A "map" in the form of an SVG file that contains a uniquely-name SVG element for each element of physical infrastructure to be shown,
and a small number of "background" map elements.
2. A CSV file (feature_timeline.csv) that associates each named SVG element with the year it opened, and the year it closed (if any), 
and some descriptive text.
3. A CSV file (timeline_links.csv) that associates each year with links to web resources relevant to transportation goings-on in the Boston region.
The intent here is to provide "teasers" to interesting content on the MPO website and other authoritative transportation-related websites.
4. A CSV file (historical_items.csv) that associates each year to text describing historical facts about the year, including notable transportation-related
goings-on elsewhere in the country and the world.

### Schema of feature_timeline.csv
| Column Name     | Contents |
| --------------- | -------- |
| layer name | HTML "id" of associated SVG element |
| milestone | Text describing the milestone (opening/closing of X) |
| start_year | Year in which facility opened or 0 for base layers |
| end_year | Year in which facility closed or 9999 is not closed |
| type | Encoding of infrastructure type (see below) |
| reopening | 'y' if start_year is the year in which a previously closed facility was reopened, otherwise blank |

#### Encoding of the __type__ field
| Coded Value     | Meaning |
| --------------- | -------- |
| a  | aeronautical facility |
| b  | bicycle facility |
| l  | legislative event | 
| h  | highway facility |
| r  | railroad facility |
| t  | transit facility |
| w  | water-transit facility |
| z  | base layer |

Note: The _type_ field is currently unused in the application.

### Schema of timeline_links.csv
| Column Name     | Contents |
| --------------- | -------- |
| year | Year for which to display link |
| type | Type of resource, e.g., Memo, Data, Website, etc. |
| text | Descriptive text for URL |
| link | URL for web resource |
| location | "Location" of web resource: Boston MPO website or external |

### Schema of historical_items.csv
| Column Name     | Contents |
| --------------- | -------- |
| year | Year for which text should be displayed |
| text | Text to be displayed |

### Generation of HTML "index" Page for the App
The HTML page for the application _contains_ the SVG "map" described above,
under data source #1. This SVG file was created by Ken Dumas. Because the
contents of this map varied during the course of development - and will vary
in the future if/when features representing other transportation infrastructure
projects are added to it - incorporating it _directly_ in the HTML index.html 
file for the application seemed unwise. Moreover, the incorporation of such
a large SVG file would bloat the size of index.html, making it difficult to
adjust the UI layout as elements were added, removed, or had their position(s) 
changed.

In view of this, the appoach taken was to develop a _template_ for index.html which
contains an indication (in the form of a simple pre-processor directive) of where
an external SVG file should be included and the name of this file. 
The template is found in the __html__ subdirectory of this repository.
A _very_ simple preprocessor was written to copy and input file to an output file,
scanning the input file for "include" directives, and injecting the contents of the
included file in the output stream at the indicated place. The implementation is 
is a simple-minded, quick-and-dirty spiritual descendant of the #include 
mechanism supported by the ANSI C preprocessor. 
The code for the preprocessor is found in the file __python/html_preprocessor.py__.

## UI Organization
The user interface for the application is a hierarchical structure of HTML <div> elements.
CSS styling rules, using [Flexible Box Module](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Flexible_Box_Layout/Basic_Concepts_of_Flexbox) 
(a.k.a. "flexbox") directives, are used to organize the layout of the <divs> on the screen.
(For readers unfamiliar with the __flexbox__ model, this [Complete Guide to Flexbox](https://css-tricks.com/snippets/css/a-guide-to-flexbox/)
will be helpful.)

Ignoring the CTPS "branding" elements at the top of the page, the application page is organized as follows:
1 outer_container
    1.1 inner_container
        1.1.1 svg_container- contains SVG map
        1.1.2 inner_container_right - wraps "play/pause" button and noUiSlider control
            1.1.2.1 button_div - contains "play/pause" button 
            1.1.2.2. slider-vertical - contains noUiSlider control
2 output 
    2.1 output_header - wraps display of current year and download button
        2.1.1 output_year  - contains display of current year
        2.1.2 download_button_div - contains download button
    2.2 output_body
        2.2.1 <table> containing text and links displayed for current year

## Main UI Control
The user interface of the application is controlled by a single [noUiSlider](https://refreshless.com/nouislider/) control.
All the logic for the application is contained in the JavaScript (JS) source file __js/historical_map.js__.
The noUiSlider control is configured and initialzed in the JS function _initialize_.
Aside from initialization work, the on-change event-handler for the noUiSlider control, _sliderHandler_, 
handles the lion's share of the "work" done by the application.

## External Dependencies
The application depends upon the following external JavaScript libraries:
1. d3.js version 6.3.1 - used for reading/parsing of CSV files
2. jQuery.js version 1.12.4 - supports DOM manipulation
3. lodash.js version 4.17.15 - provides functional programming utilities
4. noUiSlider version 14.6.3 - main UI control
