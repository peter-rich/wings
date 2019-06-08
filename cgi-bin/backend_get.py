#!/usr/bin/python
# -*- coding: UTF-8 -*-
# Ass GI Module
import cgi
import os
import commands
import cgitb; cgitb.enable()
import subprocess
import json

def print_head(str_data_name, str_data_1,fn):
    print 'Content-type:text/html'
    print 
    print '<html lang="en">'
    print '<head>'
    print '<title>Jobpply - Free Bootstrap 4 Template by Colorlib</title>'
    print '<meta charset="utf-8">'
    print '<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">'
    print '<link href="https://fonts.googleapis.com/css?family=Nunito+Sans:200,300,400,600,700,800,900" rel="stylesheet">'
    print '<link rel="stylesheet" href="/css2/open-iconic-bootstrap.min.css">'
    print '<link rel="stylesheet" href="/css2/animate.css">'
    
    print '<link rel="stylesheet" href="/css2/owl.carousel.min.css">'
    print '<link rel="stylesheet" href="/css2/owl.theme.default.min.css">'
    print '<link rel="stylesheet" href="/css2/magnific-popup.css">'
    print '<link rel="stylesheet" href="/css2/aos.css">'
    print '<link rel="stylesheet" href="/css2/ionicons.min.css">'
    print '<link rel="stylesheet" href="/css2/bootstrap-datepicker.css">'
    print '<link rel="stylesheet" href="/css2/jquery.timepicker.css">'

    
    print '<link rel="stylesheet" href="/css2/flaticon.css">'
    print '<link rel="stylesheet" href="/css2/icomoon.css">'
    print '<link rel="stylesheet" href="/css2/style.css">'
    print '</head>'
    print '<body>'
    
    print '<nav class="navbar navbar-expand-lg navbar-dark ftco_navbar bg-dark ftco-navbar-light" id="ftco-navbar">'
    print '<div class="container">'
    print ' <a class="d-block" href="index.html" rel="home"><img class="d-block" src="/images/logo.png" alt="logo"></a>'
    print ' <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#ftco-nav" aria-controls="ftco-nav" aria-expanded="false" aria-label="Toggle navigation">'
    print ' <span class="oi oi-menu"></span> Menu'
    print ' </button>'
    print ' <div class="collapse navbar-collapse" id="ftco-nav">'
    print '<ul class="navbar-nav ml-auto">'
    print '<li class="nav-item cta mr-md-1"><form class="nav-link" enctype="multipart/form-data" action="/cgi-bin/backend_get.py"  method="post"><input type = "submit" value="Tools"/><input type="hidden" name="data_name" value="' + str_data_name + '"/><input type="hidden" name="data_1" value="' + str_data_1 + '"/><input type="hidden" name="fn" value="' + fn + '"/></form></li>'
    print '<li class="nav-item cta cta-colored"><form enctype="multipart/form-data" action="/cgi-bin/monitor.py" class="nav-link" method="post"><input type = "submit" value="Monitor"/><input type="hidden" name="data_name" value="' + str_data_name + '"/><input type="hidden" name="data_1" value="' + str_data_1 + '"/><input type="hidden" name="fn" value="' + fn + '"/></form></li>'

    print '</ul></div></div></nav><!-- END nav -->'

cgitb.enable(display=0, logdir="tmp/")
# Create FieldStorage instance
form = cgi.FieldStorage() 
#Get the data from the html

message = ""
str_data_name=""
str_data_1=""
state1=2
#if form.has_key('data_name'):
str_data_name  =  form.getvalue('data_name') # Project_ID
if str_data_name == "":
    message = "No User Name"

if form.has_key('data_1'):
    state1=1
    str_data_1=form.getvalue('data_1')
str_type = "1"

if form.has_key('type_file'):
    str_type = form.getvalue("type_file") # Type File
    

output1="No Output"
state2=1
output2="No Output"
fn = ""
 
if message=="" and form.has_key('testfile'):
    
    fileitem = form['testfile']
       
    if str_type <> "2" and fileitem.filename:                        
        fileitem = form['testfile']
        state1 = 1
        # strip leading path from file name to avoid
        # directory traversal attacks
        fn = os.path.basename(fileitem.filename)
        open('tmp/' + fn, 'wb').write(fileitem.file.read())
        message = 'Login successfully!'
        environment="/var/www/cgi-bin/tmp/"+fn
        os.putenv("GOOGLE_APPLICATION_CREDENTIALS", environment)
        #cmd1 = 'dstat --provider google-v2 --user "yangzhanfu"  --project ' + str_data_1 + ' --status "*" '
        with open("tmp/"+fn, "r") as f:
            temp=json.loads(f.read())
            str_data_1=temp["project_id"]
            cmd1 = 'dstat --provider google-v2 --user '+ str_data_name + ' --project ' + str_data_1 + ' --status "*" '
            ### run it ##
        output1 = subprocess.check_output(cmd1, stderr=subprocess.STDOUT, shell=True)
        #p_status = p.wait()
        #if   None:
        #    message = "Project ID fail!"
        #    state1 = 0
    elif str_type <> "2" :
        message = 'Login fail because no file upload.'

elif message=="" and str_type == "2":
    if form.has_key('data_1') :
        if form.getvalue('data_1') == "" :
            message = "No key"
    elif form.has_key('log_file') :
        if form.getvalue('log_file') == "" :
            message = "No Log File"
    elif form.has_key('input_file') :
        if form.getvalue('input_file') == "" :
            message = "No Input File"
    elif form.has_key('output_file') :
        if form.getvalue('output_file') == "" :
            message = "No Output File"
    elif form.has_key('image_file') :
        if form.getvalue('image_file') == "" :
            message = "No image_file"
    elif form.has_key('time_zone') :
        if form.getvalue('time_zone') == "" :
            message = "No Time Zone"
    
    if message == "" and state == 1:
        str_data_1 = form.getvalue("data_1")
        log_file = form.getvalue("log_file")
        input_file = form.getvalue("input_file")
        output_file = form.getvalue("output_file")
        image_file = form.getvalue("image_file")
        time_zone = form.getvalue("time_zone")
        fn = form.getvalue("fn")
        environment="/var/www/cgi-bin/tmp/"+fn
        os.putenv("GOOGLE_APPLICATION_CREDENTIALS", environment)
        cmd2 = 'dsub --project ' + str_data_1 + ' --zones ' + time_zone + ' --logging '+ log_file + ' --input BAM=' + input_file + ' --output BAI=' + output_file + ' --image ' + image_file + ' --command "samtools index ${BAM} ${BAI}"'  
        output1 = subprocess.check_output(cmd2, stderr=subprocess.STDOUT, shell=True)
        message="Successful Submit Job"
        state1=1

if message == "":
    message="Still Login"
    fn=form.getvalue("fn")

print_head(str_data_name, str_data_1,fn)

print '<div class="hero-wrap ">'
print '<div class="container">'
print '<div class=" slider-text  ">'
print '<div class="col-12 d-flex flex-wrap justify-content-between align-items-center">'
print '<div class="text "><Br><Br><Br><Br>'
print '<div style=";margin:0 60px 0 50px"><h1 >Service for the Genetic Center:' + message + '</h1>'
print '<div class="ftco-search">'
print '     <div class="row">'
print '         <div class="col-md-12 ">'
print '             <div class="nav nav-pills text-center" id="v-pills-tab" >'
print '                 <a class="nav-link active mr-md-2" id="v-pills-1-tab" data-toggle="pill" href="#v-pills-1" role="tab" aria-controls="v-pills-1" aria-selected="true">Tools Type 1</a>'
print '	                    <a class="nav-link" id="v-pills-2-tab" data-toggle="pill" href="#v-pills-2" role="tab" aria-controls="v-pills-2" aria-selected="false">Tools Type 2</a>'	    
print '             </div>'
print '	        </div>'
print '		<div class="col-md-12 tab-wrap">'
print '             <div class="tab-content p-4" id="v-pills-tabContent">'
print '	                <div class="tab-pane fade show active" id="v-pills-1" role="tabpanel" aria-labelledby="v-pills-nextgen-tab">'

if state1==1:
    print '<form enctype="multipart/form-data" action="/cgi-bin/backend_get.py"  method="post"><div class=" no-gutters">'
    print '     <div class="col-md mr-md-2">'
    print '             <div class="form-field">'
    print '                     <input type="text" name="time_zone" class="form-control" placeholder="Time Zone. eg. us-*. ">'
    print '             </div>'
    print '     </div>'
    print '	<br>'
    print '	<div class="col-md mr-md-2">'
    print '     <div class="form-field">'
    print '     <input type="text" name="log_file" class="form-control" placeholder="Log File. eg. gs://authentication-test-key/logs. ">'
    print '     </div>'
    print '     </div>'
    print '     <br>'	    
    print '<div class="col-md mr-md-2">'
    print '<div class="form-group">'
    print '<div class="form-field">'
    print '<input type="text" name="input_file" class="form-control" placeholder="Input File. eg. gs://genomics-public-data/1000-genomes/bam/HG00114.mapped.ILLUMINA.bwa.GBR.low_coverage.20120522.bam. ">'
    print '</div>'
    print '</div>'
    print '</div>'
    print '<div class="col-md mr-md-2">'
    print '<div class="form-group">'
    print '<div class="form-field">'
    print '<input type="text" name="output_file" class="form-control" placeholder="Output File. eg. gs://authentication-test-key/HG00114.mapped.ILLUMINA.bwa.GBR.low_coverage.20120522.bam.bai. ">'
    print '</div>'
    print '</div>'
    print '</div>'
    print '<div class="col-md mr-md-2">'
    print '<div class="form-group">'
    print '<div class="form-field">'
    print '<input type="text" name="image_file" class="form-control" placeholder="Image File. eg. quay.io/cancercollaboratory/dockstore-tool-samtools-index. ">'
    print '</div>'
    print '</div>'
    print '</div>'
    print '<input type="hidden" name="data_1" value="' + str_data_1 + '">'
    print '<input type="hidden" name="data_name" value="' + str_data_name + '">'
    print '<input type="hidden" name="type_file" value="2">'
    print '<input type="hidden" name="fn" value="' + fn + '">'
    print '     <div class="col-md">'
    print '	    <div class="form-group">'
    print '             <div class="form-field">'
    print '                 <button type="submit" class="form-control btn btn-secondary">Submit a Job</button>'
    print '</div>'
    print '</div>'
    print '</div>'
    print '</div>'
    print '<Br>'
    print '</form>'

print '</div>'
print '<div class="tab-pane fade" id="v-pills-2" role="tabpanel" aria-labelledby="v-pills-performance-tab">\
				              	<form action="#" class="search-job">\
				              		<div class="row">\
				              			<div class="col-md">\
				              				<div class="form-group">\
					              				<div class="form-field">\
					              					<div class="icon"><span class="icon-user"></span></div>\
									                <input type="text" class="form-control" placeholder="eg. Adam Scott">\
									              </div>\
								              </div>\
				              			</div>\
    				              			<div class="col-md">\
				              				<div class="form-group">\
				              					<div class="form-field">\
									                <button type="submit" class="form-control btn btn-secondary">Submit a Job</button>\
									              </div>\
								              </div>\
				              			</div>\
								<Br><Br><Br>\
								<HR style="border:3 double #987cb9" width="100%" color=#987cb9 SIZE=3>\
				              		</div>\
				              	</form>\
				              </div>\
				            </div>\
				          </div>\
				        </div>\
					</div>\
			        </div>\
	        </div>\
	    	</div>\
      </div>\
	</div>\
    </div>\
    <footer class="site-footer">\
	<div class="footer-widgets">\
	    <div class="container">\
		<div class="row">\
		    <div class="col-12 col-md-6 col-lg-4">\
			<div class="foot-about">\
			    <h2><a href="#"><img src="/images/logo.png" alt=""></a></h2>\
                            <p>Gemone Service.</p>\
                            <p class="footer">\
Copyright &copy;<script>document.write(new Date().getFullYear());</script> All rights reserved | by <a href="https://colorlib.com/" target="_blank">Colorlib</a></p>\
                        </div><!-- .foot-about -->\
                    </div><!-- .col -->\
                    <div class="col-12 col-md-6 col-lg-4 mt-5 mt-md-0">\
    			    <div class="foot-contact">\
	    			    <h2>Contact</h2>\
                            <ul class="p-0 m-0">\
                                <li><span>Addtress:</span> 3165 Porter Drive, Palo Alto, California, US</li>\
                                <li><span>Phone:</span>+1 7657750242</li>\
				<li><span>Email:</span>zhfuyang@stanford.edu</li>\
                            </ul>\
                        </div>\
                    </div>\
	       	</div><!-- .row -->\
            </div><!-- .container -->\
        </div><!-- .footer-widgets -->\
    </footer><!-- .site-footer -->\
    <script type="text/javascript" src="/js2/jquery.js"></script>\
    <script type="text/javascript" src="/js2/jquery.collapsible.min.js"></script>\
    <script type="text/javascript" src="/js2/swiper.min.js"></script>\
    <script type="text/javascript" src="/js2/jquery.countdown.min.js"></script>\
    <script type="text/javascript" src="/js2/circle-progress.min.js"></script>\
    <script type="text/javascript" src="/js2/jquery.countTo.min.js"></script>\
    <script type="text/javascript" src="/js2/jquery.barfiller.js"></script>\
    <script type="text/javascript" src="/js2/custom.js"></script><!-- loader -->\
  <div id="ftco-loader" class="show fullscreen"><svg class="circular" width="48px" height="48px"><circle class="path-bg" cx="24" cy="24" r="22" fill="none" stroke-width="4" stroke="#eeeeee"/><circle class="path" cx="24" cy="24" r="22" fill="none" stroke-width="4" stroke-miterlimit="10" stroke="#F96D00"/></svg></div>\
  <script src="/js2/jquery.min.js"></script>\
  <script src="/js2/jquery-migrate-3.0.1.min.js"></script>\
  <script src="/js2/popper.min.js"></script>\
  <script src="/js2/bootstrap.min.js"></script>\
  <script src="/js2/jquery.easing.1.3.js"></script>\
  <script src="/js2/jquery.waypoints.min.js"></script>\
  <script src="/js2/jquery.stellar.min.js"></script>\
  <script src="/js2/owl.carousel.min.js"></script>\
  <script src="/js2/jquery.magnific-popup.min.js"></script>\
  <script src="/js2/aos.js"></script>\
  <script src="/js2/jquery.animateNumber.min.js"></script>\
  <script src="/js2/scrollax.min.js"></script>\
  <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBVWaKrjvy3MaE7SQ74_uJiULgl1JY0H2s&sensor=false"></script>\
  <script src="/js2/google-map.js"></script>\
  <script src="/js2/main.js"></script>\
  </body>\
</html>'
