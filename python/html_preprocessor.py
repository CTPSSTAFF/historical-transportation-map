# Python script implementing a simple-minded pre-processor for HTML.
# The pre-processor supports one directive, which must be within a one-line HTML comment:
#	  include(<file_name>)
#
# The pre-processor copies all input to the output, except when it encounters an "include"
# directive. At that point the contents of the included file are written to the output before
# resuming reading-writing of the remaining lines in the input HTML file.
#
# The intended use is to allow the SVG "map" produced by Ken Dumas to be incorporated into
# the index.html page for the "historical transportaiton map" application automatically.
#
# -- B. Krepp 2/1/2021

# Function: preprocess_html
# Parameters:
#	in_html_template - input HTML file which may contain #include directives
#	out_html - output HTML file, with any/all included file(s) incorporated at the appropriate point(s)
# Summary:
#	Copies input to output one line at a time.
#	When a #include directive is encountered, the relevant file is opened and written in its entireity
#	to the output. When the included file has been written to output, the copying of the (principal)
#	input to the output is resumed.
#
home_dir = r'C:/Users/ben_k/work_stuff/historical-transportation-map/'
in_html_fp = None
out_html_fp = None
def preprocess_html(in_html_template_fn, out_html_fn):
	global in_html_fp, out_html_fp, home_dir
	in_html_fp = open(in_html_template_fn, 'r')
	out_html_fp = open(out_html_fn, 'w')
	in_lines = in_html_fp.readlines()
	for line in in_lines:
		if line.find('#include(') == -1:
			out_html_fp.writelines([line])
		else:
			print("Found include directive.")
			# SVG file inclusion
			startpos = line.find('(') + 1
			endpos = line.find(')')
			include_fn = home_dir + line[startpos:endpos]
			# s = 'Reading included file ' + include_fn
			# print(s)
			include_fp = open(include_fn, 'r')
			included_lines = include_fp.readlines()
			out_html_fp.writelines(included_lines)
			include_fp.close()
			# print(s)
		# end_if
	# end_for

	in_html_fp.close()
	out_html_fp.close()
# end_def preprocess_html()

# Generate the "index.html" file that includes the SVG inset map:
in_html_template = home_dir + 'html/index_with_inset_template.html'
out_html = home_dir + 'index.html'
preprocess_html(in_html_template, out_html)
# Generate the "map.html" file that includes the SVG inset map:
in_html_template = home_dir + 'html/map_with_inset_template.html'
out_html = home_dir + 'map.html'
preprocess_html(in_html_template, out_html)
