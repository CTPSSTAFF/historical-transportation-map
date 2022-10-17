/*
	Mapping Boston's Historical Transporatation Infrastructure App
	
	Inputs:
		0. SVG map of historical transportation infrastructure, 
		   embedded in the index.hmtl file for this app
		1. Historical transportation feature timeline CSV file.
		   The records in this file are indexed by year, and 
		   indicate the start- and end-years in which transportation
		   features in the SVG are visible. It also contains some
		   records for which there is no corresponding layer in the
		   SVG, e.g., features outside the Boston region MPO area.
		2. Links to web resources CSV file.
		   The records in this file are indexed by year, and 
		   specify links to web resources for the transportation
		   "events" for the year in question.
		3. Miscellaneous historical facts CSV file.
		   The records in this file are indexed by year, and
		   specify the text of interesting (mostly transportation-related)
		   facts for the year in question.
		
	Control:
		The app is controlled by the "noUIslider Control:
			https://refreshless.com/nouislider/
		The GitHub repository for this is:
			https://github.com/leongersen/noUiSlider

	-- B. Krepp, attending metaphysician
*/

// Symbolic constants - first and last years for which we have data
var FIRST_YEAR = 1800,
    LAST_YEAR = 2022;
	
// The UI element controlling the app:
var verticalSlider = document.getElementById('slider-vertical');

// Data from the historical transportation feature timeline CSV, and subsets thereof:
var all_records = [],			// All records in feature_timeline CSV file
	all_milestones = [];		// All milestones in feature_timeline CSV file (base layers are not milestones);
                                // includes milestones w/o a layer, "base layers", and toggleable layers

// Layers in the SVG map:
var all_layers = [],			// All layers in SVG file, includes "base layers" and toggleable layers
	toggleable_layers = [];		// Toggle-able layers in SVG map
	
// All records from the links to web resources CSV file:
var timeline_links = [];
	
// All records from the miscellaneous historical facts CSV file:
var historical_data = [];
	
var debugFlag = false;


// makeTable: Generate an HTML table from _data_ that emulates an HTML unordered list.
//            Each row of the table consists of two columns:
//            1. the "bullet" symbol, i.e.,  the HTML &bullet; entity
//            2. the  property, specified by the propName parameter,
//               in each record of the _data_ parameter
// The purpose of this folderol is to ensure that the text, if wrapped,
// will be indented uniformly to the right of the bullet symbol.
// The CSS class associated with the <td> containing the "bullet" symbol
// in column 1 ensures that the contents of this <td> are aligned with
// the top of the cell.
//
// Parameters:
//     aData - array of objects, the text property of each is to be rendered into
//             column 2 of the generated HTML table
//     propertyToGet - name of property in records in aData to be rendered
//     textClass - CSS class to apply to the HTML <td>s in column 2 of
//                        the table
// Return value: 
//    string containing text of HTML table for the whole shebang
//
// Note: This function is _logically_ nested within "sliderHandler",
//       though it isn't (yet) _lexically_ nested within it.
//
function makeTable(aData, propName, textClass) {
	var retval = '';
	retval += '<table>';
	retval += '<tbody>';
	aData.forEach(function(row) {
		retval += '<tr>'
		retval += '<td class="fake_li_bullet">';
		retval += '&bullet;';
		retval += '</td>';
		retval += '<td class="' + textClass + '">';
		retval += row[propName];
		retval += '</td>';
		retval += '</tr>';
	});
	retval += '</tbody>';
	retval += '</table>';
	return retval;
} // makeTable()


// makeTableWithLinks: A customized version of "makeTable" to generate an
//                     HTML table the second column of which contains URLs.
//
// Parameters:
//     aData - array of objects, the text property of each is to be rendered into
//             column 2 of the generated HTML table
//     urlPropName - name of property in records in aData containing URL
//     txtPropName - name of properts in records in aData containing the
//                   text to be displayed in place of the raw URL
//     textClass - CSS class to apply to the HTML <td>s in column 2 of
//                 the table
//
// Return value:
//    string containing text of HTML table for the whole shebang
// 
// Rather than attempt to parameterize makeTable to also handle the 
// functionality required here, the decsion was taken to write a 
// customized function for it, for the sake of expediency.
//
// Note: This function is also _logically_ nested within "sliderHandler",
//       though it isn't (yet) _lexically_ nested within it.
//
function makeTableWithLinks(aData, urlPropName, txtPropName, textClass) {
	var retval = '';
	retval += '<table>';
	retval += '<tbody>';
	aData.forEach(function(row) {
		retval += '<tr>'
		retval += '<td class="fake_li_bullet">';
		retval += '&bullet;';
		retval += '</td>';
		retval += '<td class="' + textClass + '">';
		retval += row['type'] + ': ';
		retval += '<a class="resource_link" href="' + row[urlPropName] + '"';
		retval += ' target="_blank">'
		retval += row[txtPropName];
		retval += '</a>';
		retval += '</td>';
		retval += '</tr>';
	});
	retval += '</tbody>';
	retval += '</table>';
	return retval;
} // makeTableWithLinks()

// sliderHandler: Event handler for slider 'update' event
//
// This function is the real "workhorse" of the app.
// Its signature is as defined by the "noUiSlider" API:
// 		values: Current slider values (array);
// 		handle: Handle that caused the event (number);
// 		unencoded: Slider values without formatting (array);
// 		tap: Event was caused by the user tapping the slider (boolean);
// 		positions: Left offset of the handles (array);
// 		noUiSlider: slider public Api (noUiSlider);
// 
// Per the noUiSilder documentation:
//     "values" is an array containing the current slider values, with formatting applied. 
//     "handle" is the index of the handle that caused the event, starting at zero. 
//     "values[handle]" gives the value for the handle that triggered the event.
//
function sliderHandler(values, handle, unencoded, tap, positions, noUiSlider) {
	var current_year_str = values[handle];
	var current_year = +values[handle];
	if (debugFlag) { console.log('curent_year: ' + current_year); }
	
	// First: turn on/off layers according to the current year
	//
	// Turn on all toggleable layers whose 
	// start_year is <= current year AND whose end_year is > current_year.
	var to_show = _.filter(toggleable_layers, 
	                       function(rec) { 
						       //console.log('rec.layer_name ' + rec.start_year + ' ' + rec.end_year);
						       return rec.start_year <= current_year && rec.end_year > current_year; });
	to_show.forEach(function(layer) {
		var query_str  = '#' + layer.layer_name;
		if (debugFlag) { console.log('Show ' + layer.layer_name); }
		$(query_str).show();
		// var txt = layer.desc;
		// $('#output').html(txt);
	});
	// Turn off all toggleable layers whose 
	// start_year is > current_year OR whose end_year <= current_year.
	var to_hide = _.filter(toggleable_layers, function(rec) { 
													return rec.start_year > current_year || rec.end_year <= current_year; });
	to_hide.forEach(function(layer) { 
		var query_str = '#' + layer.layer_name;
		if (debugFlag) { console.log('Hiding ' + layer.layer_name); }
		$(query_str).hide();
	});
	
	// Second: Clear the variable parts of the output area
	$('#output_year').html('');
	$('#output_body').html('');
	
	// Third: Collect all milestones for the current year (there may be none)
	//        and generate the descriptive text for this year's milestones.
	// N.B. "Legislative" milestones are a subset of "opening" milestones, cull these into two distinct lists.
	var opened_this_year = _.filter(all_milestones, 
									function(rec) { 
										return rec.start_year === current_year && rec.type !== 'l' && rec.reopening === 'n'; });
	var reopened_this_year = _.filter(all_milestones, 
									function(rec) { 
										return rec.start_year === current_year && rec.type !== 'l' && rec.reopening === 'y'; });
	var legislative_this_year = _.filter(all_milestones, 
	                                     function(rec) { 
											return rec.start_year === current_year && rec.type === 'l'; });
	var closed_this_year = _.filter(all_milestones, function(rec) { return rec.end_year === current_year; });
	
	var desc_text = '';

	if (opened_this_year.length !== 0) {
		desc_text += '<h4 class="opened_list_caption">Opened:</h4>';
		desc_text += makeTable(opened_this_year, "milestone", "milestone_opened");
	}
	if (reopened_this_year.length !== 0) {
		desc_text += '<h4 class="reopened_list_caption">Reopened:</h4>';
		desc_text += makeTable(reopened_this_year, "milestone", "milestone_reopened");
	}
	if (closed_this_year.length !== 0) {
		desc_text += '<h4 class="closed_list_caption">Closed:</h4>';
		desc_text += makeTable(closed_this_year, "milestone", "milestone_closed");
	}
	if (legislative_this_year.length !== 0) {
		desc_text += '<h4 class="legislative_list_caption">Legislative events:</h4>';
		desc_text += makeTable(legislative_this_year, "milestone", "milestone_legislative");
	}
	
	// Fourth: Collect all web resources for the current year
	var resources = _.filter(timeline_links, function(rec) { return rec.year === current_year; });
	// There can dupes; remove any/all of these
	resources = _.uniqWith(resources, _.isEqual);
	if (resources.length !== 0) {
		desc_text += '<h4 class="resources_list_caption">Web resources:</h4>';
		desc_text += makeTableWithLinks(resources, "url", "txt", "resource_item");
	}
	
	// Fifth: Collect all "historical facts" for the current year
	var historical = _.filter(historical_data, function(rec) { return rec.year === current_year; });
	if (historical.length !== 0) {
		desc_text += '<h4 class="historical_list_caption">This year in history:</h4>';
		desc_text += makeTable(historical, "text", "historical_item");
	}

	// Sixth: Render the whole shebang
	$('#output_year').html(current_year);
	$('#output_body').html(desc_text);
} // sliderHandler()

var timerId = 0;
var TIMER_INTERVAL = 1500; // 1500 milliseconds === 1.5 seconds

function timerFunction() {
	var currentYear = +verticalSlider.noUiSlider.get();
	// Debug/trace
	if (debugFlag) { console.log('timerFunction called: current year = ' + currentYear); }
	if (currentYear !== LAST_YEAR) {
		verticalSlider.noUiSlider.set(currentYear + 1);
	} else {
		// Timeline exhausted: clear the interval timer
		window.clearInterval(timerId);
	}
} // timerFunction()

// Event handler for the "play" (a.k.a. "stop") button
function toggleAutoplay(evt) {
	if (evt.target.value === 'Play') {
		console.log('Starting auto-play.');
		// Change button label
		evt.target.value = 'Pause';
		// Disable user interaction with slider
		verticalSlider.setAttribute('disabled', true);
		timerId = window.setInterval(timerFunction, TIMER_INTERVAL);
		
	} else {
		console.log('Stopping auto-play.');
		// Change button label
		evt.target.value = 'Play';
		// Re-enable user interaction with slider
		verticalSlider.removeAttribute('disabled');
		// Clear the interval timer 
		window.clearInterval(timerId);
	}
} // manageAutoplay()

function initialize() {
	// The 'to' and 'from' formatter functions for the "noUiSlider" control
	// Note: *both* 'to' and 'from' formatter functions are required 
	// by the noUiSlider control, even if only one is actually used.

	// 'to' formatter function: receives a number.
	function to_formatter(value) {
		// console.log('to formater: value = ' + value);
		// $('#year').val(value.toFixed(0));
		return value.toFixed(0);
	} 
	// 'from' the formatted value: receives a string, returns a number.	
	function from_formatter(value) {
		return Number(value);
	}
	
	// Create vertical slider control.
	noUiSlider.create(verticalSlider, {
		start: 1800,
		orientation: 'vertical',
		range: {
			'min': 1800,
			'max': 2022
		},
		step: 1,
		keyboardSupport: true,
		keyboardDefaultStep: 1,
		keyboardPageMultiplier: 10,
		format: {	to: to_formatter,
					from: from_formatter
		},
		tooltips: [ { to: to_formatter, from: from_formatter } ],
		pips: {
			mode: 'values',
			values: [1800, 1820, 1840, 1860, 1880, 1900, 1920, 1940, 1960, 1980, 2000, 2020]
		}
	});
	
	// Bind event handler for 'update' [slide] event from noUiSlider control
	verticalSlider.noUiSlider.on('update', sliderHandler);
	
	var timeline_csv_fn = 'csv/feature_timeline.csv',
	    links_csv_fn = 'csv/timeline_links.csv',
		historical_csv_fn = 'csv/historical_items.csv';
	
	// Load the "historical transportation feature timeline CSV"
	d3.csv(timeline_csv_fn, function(d) {
		return {	layer_name:	d.layer_name.replace('"',''),
					start_year: +d.start_year,
					end_year: 	+d.end_year,
					type:		d.type,
					reopening:	(d.reopening === null || d.reopening === '') ? 'n' : d.reopening,
					milestone:	d.milestone
		};
	}).then(function(timeline_data) {
		all_records = timeline_data;	// Temp, for debugging
		all_milestones = _.filter(timeline_data, function(rec) { return rec.type !== 'z'; });
		all_layers = _.filter(timeline_data, function(rec) { return rec.layer_name !== 'NULL'; });
		toggleable_layers = _.filter(all_layers, function(rec) { return rec.type !== 'z'; });
		
		// Hide all toggleable layers at initialization
		toggleable_layers.forEach(function(layer) { 
			var query_str = '#' + layer.layer_name;
			$(query_str).hide();
		});
		
		// Load the "links to web resources CSV"
		d3.csv(links_csv_fn, function(d) {
			return {	year:	+d.year,
						type:	d.type,
						txt: 	d.text,
						url: 	d.link
			};
		}).then(function(links_data) {
			timeline_links = links_data;
			
			// Load the "miscellaneous historical facts CSV"
			d3.csv(historical_csv_fn, function(d) {
				return { year:	+d.year,
						 text: 	d.text
				};
			}).then(function(historical_records) {
				historical_data = historical_records;
				verticalSlider.noUiSlider.set(FIRST_YEAR);
				$('#play_button').on('click', toggleAutoplay);
			});
		});
	});
} // initialize()

$(document).ready(function() {
	initialize();
});