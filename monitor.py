#!/usr/bin/python
# -*- coding: UTF-8 -*-
# Ass GI Module
import cgi
import os
import commands
import cgitb; cgitb.enable()
import subprocess
import json
import sqlite3
import csv
import tools


state1=1
message= ""
cgitb.enable(display=0, logdir="tmp/")
# Create FieldStorage instance
form = cgi.FieldStorage() 
#Get the data from the html
str_data_1 = form.getvalue('data_1')
str_type = 1
str_type = form.getvalue("type_file")




output1="No 1 Output"
state2=1
output2="No 2 Output"
output_d="No Delete Output"
fn = ""

if form.has_key("delete"):
    fn = form.getvalue("fn")
    environment="/var/www/cgi-bin/tmp/"+fn
    os.putenv("GOOGLE_APPLICATION_CREDENTIALS", environment)

    for i in range(1, 20):
        if form.getvalue(str(i)):
            cmd="ddel  --project " + str_data_1 + " --provider google-v2  --jobs " + form.getvalue("id_" + str(i))
            #message = form.getvalue("id_" + str(i))
            output =  subprocess.check_output(cmd, stderr=subprocess.STDOUT, shell=True)
            
if state1 == 1 and message == "": 
    message="Monitor"
    message2=""
    fn = form.getvalue("fn")
    environment="/var/www/cgi-bin/tmp/"+fn
    os.putenv("GOOGLE_APPLICATION_CREDENTIALS", environment)
    # Status connect the database 
    conn = sqlite3.connect('/var/www/cgi-bin/tmp/' + str_data_1 + '/record.db')
    # Status CMD 3 for full
    cmd3 = 'dstat --project ' + str_data_1 + ' --provider google-v2  --status "*" --full'
    # output1 = subprocess.check_output(cmd2, stderr=subprocess.STDOUT, shell=True)
    output2 =  subprocess.check_output(cmd3, stderr=subprocess.STDOUT, shell=True)
    #file_1 = "/var/www/cgi-bin/tmp/tmp1.out"
    # Output File 1
    #with open(file_1, "w") as f:
    #    f.write(output1)
    # Output File 2
    file_2 = "/var/www/cgi-bin/tmp/tmp2.out"
    with open(file_2, "w") as f:
        f.write(output2)
    cmd4 = 'grep  "job-id\|creat\|logging: g\|status:\|job-name\|end-time" /var/www/cgi-bin/tmp/tmp2.out'
    output3 =  subprocess.check_output(cmd4, stderr=subprocess.STDOUT, shell=True)

    str_type="3"
else :
    message="Unknow Missing!"

tools.print_head(str_data_1,fn, message)

print '             <div  id="v-pills-tabContent">'
print '	                <div class="tab-pane fade show active" id="v-pills-1" role="tabpanel" aria-labelledby="v-pills-nextgen-tab">'


n=1

def write_csv(data):

    with open('/var/www/cgi-bin/tmp/record.csv', 'wb') as f:
        writer = csv.writer(f)
        writer.writerow(['Job Id', 'Job Name', 'Status', 'Last Updata', 'Create Time', 'Log File Link'])
        writer.writerows(data)

if state1==1 and str_type=="3":
    print '<form enctype="multipart/form-data" action="/cgi-bin/monitor.py"  method="post"><div class=" no-gutters" >'
    print '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'
    print '<font color="black">Start Time:</font> <input type="datetime-local" value="2015-09-24T13:59:59"/>'
    print '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'
    print '<font color="black">End Time:</font> <input type="datetime-local" value="2015-09-24T13:59:59"/>'
    
    print '<Br>'
    print '<input type="submit" name="refresh" value="Refresh" class="btn btn-light" />'
    print '<input type="submit" name="delete" value="Delete" class="btn btn-dark"  />'
    print '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'
    print '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'
    print '<input type="text" name="search_content" type="text" size="45"  placeholder="Search Content you want">' 
    print '<input type="submit" name="search" value="Search" class="btn btn-success">'
    print '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'
    print '<a href="/cgi-bin/download.py" name="download">Download The CSV</a>'
    print '<Br>'
    print '     <div class="col-md mr-md-4 table-wrapper-scroll-y my-custom-scrollbar" id="app" >'
    print '<table class="table table-bordered  mb-0"><thead>'
    print '  <tr bgcolor="#66ccff">'
    print '<th scope="col"><input type="checkbox" id="checkbox" v-model="checked" @change="changeAllChecked()"> </th>'
    print '<th scope="col">#</th>'
    print '<th scope="col">Job Id</th>'
    print '<th scope="col">Name</th>'
    print '<th scope="col">Status</th>'
    print '<th scope="col">Last Update</th>'
    print '<th scope="col">Create Time</th>'
    print '<th scope="col">Link to the Log File</th>'
    print '</tr>'
    print '</thead>'
    print '<tbody>'

    length = len(output3)
    tmp1=""
    tmp2=""
    tmp3=""
    tmp4=""
    tmp5=""

    tmp_id=""
    tmp=""
    tmp_status=""
    state3=1
    count=1


    c = conn.cursor()

    c.execute("create table if not exists history (job_id unique, name, status, last_update, create_time, link)")
   
    if form.has_key("search"):
        search_content = form.getvalue("search_content")
        data = c.execute("select * from history where history.name LIKE '%" + search_content + "%' or  history.create_time LIKE '%" + search_content+ "%' ")
        data2 = data
                
        for row in data2:
            #print row
            tools.print_table(str(row[0]), str(row[1]), str(row[2]), str(row[3]), str(row[4]), str(row[5]), n)
            n = n + 1 
        data = c.execute("select * from history where history.name LIKE '%" + search_content + "%' or  history.create_time LIKE '%" + search_content+ "%' ")
        write_csv(data)

    else:
        for i in range(0, length):
            expected=0
            if output3[i]=="\n":
                num = 12
                if count == 1:
                    tmp4 = tmp
                    tmp = ""
                elif count == 2:
                    tmp3 = tmp
                    tmp = ""
                elif count == 3:
                    tmp_id = tmp
                    tmp = ""
                elif count == 4:
                    tmp1 = tmp
                    tmp = ""
                elif count == 5:
                    tmp5 = tmp
                    tmp = ""
                if count == 6:
                    tmp2 = tmp 
                    count = 0
                    tmp_id = tmp_id[10:]
                    tmp1 = tmp1[11:]
                    tmp2 = tmp2[10:]
                    tmp3 = tmp3[13:(len(tmp3)-8)]
                    tmp4 = tmp4[16:(len(tmp4)-8)]
                    tmp5 ="https://storage.cloud.google.com/" + tmp5[16:] + "?authuser=2" 
                    tools.print_table(tmp_id, tmp1, tmp2, tmp3, tmp4, tmp5, n)
                    if "--" in tmp_id[10:] and ("SUCCESS" in tmp2 or "FAILURE" in tmp2 or "CANCELED" in tmp2):
                        c.execute("insert or ignore into history (job_id, name, status, last_update, create_time, link) values('"+ tmp_id +"', '"+ tmp1 +"', '"+ tmp2 +"', '"+ tmp3 +"', '"+ tmp4 +"', '"+ tmp5 +"')") 
                                
                    n = n + 1
                    tmp1 = ""
                    tmp2 = ""
                    tmp3 = ""
                    tmp_status=""
                    tmp4 = ""
                    tmp5 = ""
                    tmp_id = ""
                count = count + 1
                tmp = ""
            else:
                tmp = tmp + output3[i]
            
        data = c.execute("select * from history")
        write_csv(data)

    conn.commit()
    conn.close()

    print '</tbody>'
    print '</table>'                                                                                                                
    print '</div>'
    print '	<br>'
    print '     <br>'	    
    print '<input type="hidden" name="data_1" value="' + str_data_1 + '">'
    print '<input type="hidden" name="fn" value="' + fn + '">'
    print '</div>'
    print '<Br>'
    print '</form>'

tools.print_back(n)
