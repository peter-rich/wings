#!/usr/bin/python
# -*- coding: UTF-8 -*-
# Ass GI Module
import cgi
import os
import commands
import cgitb; cgitb.enable()
import subprocess

def print_fun():
    print 'Content-type:text/html'
    print
    print '<html>'
    print '<head>'
    print '<meta charset=\"utf-8\">'
    print '<title>MainPage</title>'
    print '<script src="http://upcdn.b0.upaiyun.com/libs/jquery/jquery-2.0.2.min.js"></script>'                                                 
    print '<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" crossorigin="anonymous">' 
    print '<link href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-fileinput/5.0.1/css/fileinput.min.css" media="all" rel="stylesheet" type="text/css" />'
    print '<link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.5.0/css/all.css" crossorigin="anonymous">'  
    print '<script src="https://code.jquery.com/jquery-3.3.1.min.js" crossorigin="anonymous"></script>'
    print '<script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-fileinput/5.0.1/js/plugins/piexif.min.js" type="text/javascript"></script>'  
    print '<script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-fileinput/5.0.1/js/plugins/sortable.min.js" type="text/javascript"></script>'
    print '<script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-fileinput/5.0.1/js/plugins/purify.min.js" type="text/javascript"></script>'
    print '<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js"></script>'
    print '<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.bundle.min.js" crossorigin="anonymous"></script>'
    print '<script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-fileinput/5.0.1/js/fileinput.min.js"></script>'
    print '<script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-fileinput/5.0.1/themes/fas/theme.min.js"></script>'                         
    print '<script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-fileinput/5.0.1/js/locales/LANG.js"></script>'
    print '</head>'
    print '<body>'
    print '<Br><Br>'     

cgitb.enable(display=0, logdir="tmp/")
# Create FieldStorage instance
form = cgi.FieldStorage() 
#Get the data from the html
str_data_1  =  form.getvalue('data_1') # Project_ID
str_type = 1
str_type = form.getvalue("type_file")

message=""
state1=2
output1="No Output"
state2=1
output2="No Output"
fn = ""


if form.has_key('testfile'):
    fileitem = form['testfile']
    output1 = subprocess.check_output("touch tmp/log"+ str(str_type)+".out", stderr=subprocess.STDOUT, shell=True)


    if str_type <> 2 and fileitem.filename: 
   
        fileitem = form['testfile']
        state1 = 1
        # strip leading path from file name to avoid
        # directory traversal attacks
        fn = os.path.basename(fileitem.filename)
        open('tmp/' + fn, 'wb').write(fileitem.file.read())
        message = 'Login successfully!'
        environment="/var/www/cgi-bin/tmp/"+fn
        os.putenv("GOOGLE_APPLICATION_CREDENTIALS", environment)
        cmd1 = 'dstat --provider google-v2 --user "yangzhanfu"  --project ' + str_data_1 + ' --status "*" '
        ### run it ##
    
        #output1 = subprocess.check_call(cmd1, shell=True)
        output1 = subprocess.check_output(cmd1, stderr=subprocess.STDOUT, shell=True)
        #p_status = p.wait()
        #if   None:
        #    message = "Project ID fail!"
        #    state1 = 0
    elif str_type <> 2:
        message = 'Login fail because no file upload.'
else:
    
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

print_fun()
# Print out for testing
print "<p> {(Middle test output->)} %s</p>" % (output1)
print '<p align="center"><font color="blue" size="8">' + str_data_1 + ":" + message + '</font></p>'  
print '<Br><Br>'

if state1 == 1:
    print '<div style=";margin:0 60px 0 50px">'
    print '<form enctype="multipart/form-data" action="/cgi-bin/backend_get.py"  method="post" >'
    print 'Time Zone: &nbsp&nbsp <input class="col-xs-6 col-sm-4" type="text"  name="time_zone"/>'
    print '<Br></Br>'
    print 'Log file: &nbsp&nbsp <input class="col-xs-6 col-sm-4" type="text" name="log_file" />'
    print '<Br></Br>'
    print 'Input file: &nbsp&nbsp <input class="col-xs-6 col-sm-4" type="text" name="input_file" />'
    print '<Br></Br>'
    print 'Output_file: &nbsp&nbsp  <input class="col-xs-6 col-sm-4" type="text" name="output_file" />'
    print '<Br><Br>'
    print 'Image: &nbsp&nbsp <input class="col-xs-6 col-sm-4" type="text" name="image_file">'
    print '<Br><Br>'
    print '<input type="hidden" name="data_1" value="' + str_data_1 + '">'
    print '<input type="hidden" name="type_file" value="2">'
    print '<input type="hidden" name="fn" value="' + fn + '">'
    print '&nbsp <input class="btn btn-primary" type="submit" id="submit" value="Submit Job">'
    print '<Br><Br>'
    print '</form>'
    print '</div>' 
    
print '<Br><Br><Br>'
print '<HR style="border:3 double #987cb9" width="100%" color=#987cb9 SIZE=3>'                                                                                                                                                          
print '<div class="footer">'
print '<p>© 2019 . All rights reserved | Design by <a href="http://zhanfuyang.com">Zhanfu Yang</a></p>'
print '</div></body>'
print '</html>'
