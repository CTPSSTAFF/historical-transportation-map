# Python script to generate an HTML file for the historical mapping application,
# "including" the SVG file provided by Ken Dumas.
# 
# -- B. Krepp 12/23/2020


# function: generate_html
# Summary: given an SVG file (in_svg_fn), generate an HTML file (out_html_fn)
# that "wraps" the SVG with the requisite HTML structure, including <script>
# and <link> tags for JavaScript and CSS files.
#
def generate_html(in_svg_fn, out_html_fn):
	in_svg_fp = open(in_svg_fn, 'r')
	svg_data = in_svg_fp.read()
	in_svg_fp.close()
	
	out_html_fp = open(out_html_fn, 'w')
	# The beginning material
	out_html_fp.write('<!doctype html>\n')
	out_html_fp.write('<html lang="en">\n')
	out_html_fp.write('<head>\n')
	out_html_fp.write('<meta charset="utf-8">\n')
	out_html_fp.write('<meta name="viewport" content="width=device-width, initial-scale=1">\n')
	out_html_fp.write('<title>Test Map #1 </title>\n')
	out_html_fp.write('<link rel="stylesheet" href="css/test_map_1.css">\n')
	out_html_fp.write('<link rel="stylesheet" href="libs/nouislider.css">\n')
	out_html_fp.write('<script src="https://code.jquery.com/jquery-1.12.4.js"></script>\n')
	out_html_fp.write('<script src="libs/lodash.js"></script>\n')
	out_html_fp.write('<script src="libs/nouislider.js"></script>\n')
	out_html_fp.write('<script src="libs/d3.min.js"></script>\n')
	out_html_fp.write('</head>\n')
	out_html_fp.write('<body>\n')
	# Start of matieral for CTPS "branding"
	out_html_fp.write('<div class="ctpsHeader">\n')
	out_html_fp.write('<div class="lightBlue"></div>\n')
	out_html_fp.write('<div class="darkBlue"></div>\n')
	out_html_fp.write('<div id="banner">\n')
	out_html_fp.write('<a href="https://www.ctps.org/" target="_blank" title="Boston MPO">\n')
	out_html_fp.write('<img style="height:59px" src="img/ctps_header.png" title="Opens Boston MPO website in a new window">\n')
	out_html_fp.write('</a>\n')
	out_html_fp.write('</div>\n')
	out_html_fp.write('</div>\n')
	# End of material for CTPS "branding"
	out_html_fp.write('<div id="outer_container">\n')
	out_html_fp.write('<div id="svg_container">\n')
	
	# The SVG from Ken
	out_html_fp.write(svg_data)
	
	# The concluding material:
	# End of SVG container div
	out_html_fp.write('</div> <!-- svg_container -->\n')
	# Div for slider control
	out_html_fp.write('<div id="slider-vertical">\n')
	out_html_fp.write('</div>\n')
	# Div for text output pane
	out_html_fp.write('<div id="output">\n')
	out_html_fp.write('</div>\n')
	# End of outer container div
	out_html_fp.write('</div> <!-- outer_container -->\n')
	# Script tag for app code, end of body and html tags
	out_html_fp.write('<script src="test_map_1.js"></script>\n')
	out_html_fp.write('</body>\n')
	out_html_fp.write('</html>\n')
	
	out_html_fp.close()
# end_def generate_html()

home_dir = r'C:/Users/ben_k/work_stuff/prototype-historical-map/'
in_svg = home_dir + 'svg/Timeline_Base_Map-Master-Inline-Style.svg'
out_html = home_dir + 'test_map_1.html'

