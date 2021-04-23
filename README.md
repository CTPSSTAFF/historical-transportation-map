# historical-transportation-map
Historical transportation map of the Boston Region.

This project, Mapping Major Transportation Infrastructure, is funded by Boston Region MPO UPWP project #13307 for Federal Fiscal Year 2021.

* Project Manager: Ken Dumas
* Principal Developer: Ben Krepp

## Technical Overview

The Historical Transportation Map of the Boston Region is an interactive graphics application that displays
major changes to the transportation infrastructure in the Boston region between 1800 and the present (2021.)
It is important to note that it is a _graphics application_, not a _GIS application. 
That is to say, the application is an interactive / animated on-line presentation of material that was
previously presented in a large PDF wall poster. 
Moving to on-line, interactive delivery allows the informaiton presented to be updated at-will, 
and for new "editions of the poster" to be published very quickly - all without incurring the costs
associated with physical publication and delivery.

### Data Sources
The data sources for this application are:
1. An SVG file containing a uniquely-name SVG element for each element of physical infrastructure to be shown,
and a small number of "background" map elements.
2. A CSV file (feature_timeline.csv) that associates each named SVG element with the year it opened, and the year it closed (if any), 
and some descriptive text.
3. A CSV file (timeline_links.csv) that associates each year with links to web resources relevant to transportation goings-on in the Boston region.
The intent here is to provide "teasers" to interesting content on the MPO website and other authoritative transportation-related websites.
4. A CSV file (historical_items.csv) that associates each year to text describing historical facts about the year, including notable transportation-related
goings-on elsewhere in the country and the world.

#### feature_timeline.csv Schema
| Column Name     | Contents |
| --------------- | -------- |
| layer name | HTML "id" of associated SVG element |
| milestone | Text describing the milestone (opening/closing of X) |
| start_year | Year in which facility opened or 0 for base layers |
| end_year | Year in which facility closed or 9999 is not closed |
| type | Encoding of infrastructure type (see below) |
| reopening | 'y' if start_year is the year in which a previously closed facility was reopened, otherwise blank |

##### Encoding of __type__ field
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

#### timeline_links.csv Schema
| Column Name     | Contents |
| --------------- | -------- |
| year | Year for which to display link |
| type | Type of resource, e.g., Memo, Data, Website, etc. |
| text | Descriptive text for URL |
| link | URL for web resource |
| location | "Location" of web resource: Boston MPO website or external |

#### historical_items.csv Schema


#### Generation of HTML Page for the App

### UI Organization


### UI Controls

