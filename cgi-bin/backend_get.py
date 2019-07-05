#!/usr/bin/python
# -*- coding: UTF-8 -*-
# Ass GI Module
import cgi
import os
import commands
import cgitb; cgitb.enable()
import subprocess
import json
import tools

cgitb.enable(display=0, logdir="tmp/")
# Create FieldStorage instance
form = cgi.FieldStorage() 
#Get the data from the html

message = ""
str_data_1=""
state1=2

if form.has_key('data_1'):
    state1=1
    str_data_1=form.getvalue('data_1')
str_type = 1

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
            cmd1 = 'dstat --provider google-v2  --project ' + str_data_1 + ' --status "*" '
            ### run it ##
        output1 = subprocess.check_output(cmd1, stderr=subprocess.STDOUT, shell=True)
        cmd6_1 = 'mkdir -p /var/www/cgi-bin/tmp/' + str_data_1 + '/'
        cmd6_2 = 'cp /home/yangzhanfu/record.db /var/www/cgi-bin/tmp/' + str_data_1 + '/'
           
        os.system(cmd6_1)
        os.system(cmd6_2)
            
        #p_status = p.wait()
        #if   None:
        #    message = "Project ID fail!"
        #    state1 = 0
    elif str_type <> "2" :
        message = 'Login fail because no file upload.'

elif message=="" and str_type == "2":
    
    tool_type = form.getvalue("tool_type")

    if tool_type == "1":
        if form.has_key('data_1') :
            if form.getvalue('data_1') == "" :
                message = "No key"
        elif form.has_key('input_file_1') :
            if form.getvalue('input_file_1') == "" :
                message = "No Input File"
        elif form.has_key('time_zone') :
            if form.getvalue('time_zone') == "" :
                message = "No Time Zone"
        elif form.has_key('sample_name') :
            if form.getvalue('sample_name') :
                message = "No sample name"
        elif form.has_key('bucket') :
            if form.getvalue('bucket'):
                message = "No bucket"
    
        if message == "" and state1 == 1:
            str_data_1 = form.getvalue("data_1")
            log_file = form.getvalue("log_file")
            sample_name = form.getvalue("sample_name")
            bucket = form.getvalue("bucket")

            input_file_1 = form.getvalue("input_file_1")
            input_file_2 = form.getvalue("input_file_2")
            time_zone = form.getvalue("time_zone")
            fn = form.getvalue("fn")
            environment="/var/www/cgi-bin/tmp/"+fn
            os.putenv("GOOGLE_APPLICATION_CREDENTIALS", environment)
            os.putenv("sample", sample_name)
            os.putenv("mvp_bucket", bucket)
            os.putenv("mvp_project", str_data_1)
            os.putenv("mvp_gatk_image", "jinasong/wdl_runner:latest")
            os.putenv("HOME", "/var/www/cgi-bin/tmp/gcloud")
            load_dict=None
            
            with open("/home/yangzhanfu/gatk-mvp/mvp.hg38.inputs.json",'r') as load_f:
                load_dict = json.load(load_f)
            
            load_dict["germline_single_sample_workflow.sample_name"] = sample_name
            load_dict["germline_single_sample_workflow.base_file_name"] = sample_name
            load_dict["germline_single_sample_workflow.final_vcf_base_name"] = sample_name
            #load_dict["germline_single_sample_workflow.skip_QC"] = False

            if input_file_2 == "":
                load_dict["germline_single_sample_workflow.flowcell_unmapped_bams"] = [input_file_1]
            else:
                load_dict["germline_single_sample_workflow.flowcell_unmapped_bams"] = [input_file_1, input_file_2]
                
            with open("/home/yangzhanfu/gatk-mvp/mvp.hg38.inputs.json",'w') as dump_f:
                json.dump(load_dict, dump_f)
            load_dict = None 
            with open("/home/yangzhanfu/gatk-mvp/gatk-mvp-pipeline/generic.google-papi.options.json",'r') as load_f:
                load_dict = json.load(load_f)
            load_dict["default_runtime_attributes"]["zones"]="us-west1-a us-west1-b us-west1-c"

            with open("/home/yangzhanfu/gatk-mvp/gatk-mvp-pipeline/generic.google-papi.options.json",'w') as dump_f:
                json.dump(load_dict, dump_f)
            
            cmd4 = 'cp  /home/yangzhanfu/gatk-mvp/mvp.hg38.inputs.json  /home/yangzhanfu/gatk-mvp/${sample}.hg38.inputs.json'
            cmd5 = 'chmod +777  /home/yangzhanfu/gatk-mvp/${sample}.hg38.inputs.json'
            cmd7 = 'gcloud auth activate-service-account --key-file $GOOGLE_APPLICATION_CREDENTIALS'
            cmd9 = "gsutil cp -r /home/yangzhanfu/gatk-mvp/gatk-mvp-pipeline/ gs://${mvp_bucket}"
            cmd8 = "gsutil cp  /home/yangzhanfu/gatk-mvp/${sample}.hg38.inputs.json gs://${mvp_bucket}/${sample}/${sample}.hg38.inputs.json"
            output4 = subprocess.check_output(cmd4, stderr=subprocess.STDOUT, shell=True)
            output5 = subprocess.check_output(cmd5, stderr=subprocess.STDOUT, shell=True)
            status, output7 = commands.getstatusoutput(cmd7)
            status, output8 = commands.getstatusoutput(cmd8)
            status, output9 = commands.getstatusoutput(cmd9)
 
            #open('tmp/output8.log', 'wb').write(output8)

            cmd2 = "dsub  --provider google-v2 \
                    --project ${mvp_project} \
                    --zone " + time_zone + " \
                    --min-cores 1 \
                    --min-ram 6.5 \
                    --image ${mvp_gatk_image}   --logging gs://${mvp_bucket}/${sample}/logging   --input CFG=gs://${mvp_bucket}/gatk-mvp-pipeline/google-adc.conf   --input OPTION=gs://${mvp_bucket}/gatk-mvp-pipeline/generic.google-papi.options.json   --input WDL=gs://${mvp_bucket}/gatk-mvp-pipeline/fc_germline_single_sample_workflow.wdl   --input SUBWDL=gs://${mvp_bucket}/gatk-mvp-pipeline/tasks_pipelines/*.wdl   --input INPUT=gs://${mvp_bucket}/${sample}/${sample}.hg38.inputs.json   --env MYproject=${mvp_project}   --env ROOT=gs://${mvp_bucket}/${sample}/output   --command 'java -Dconfig.file=${CFG} -Dbackend.providers.JES.config.project=${MYproject} -Dbackend.providers.JES.config.root=${ROOT} -jar /cromwell/cromwell.jar run ${WDL} --inputs ${INPUT} --options ${OPTION}'"
            output1 = subprocess.check_output(cmd2, stderr=subprocess.STDOUT, shell=True)
            
            cmd3 = 'dstat --project '+str_data_1+' --provider google-v2  --jobs '+output1[4:42]+' --state "*"'
            output2 = commands.getoutput(cmd3)
            state1=1
            
            message = output8#"Successful Submit GATK"
            


    elif tool_type == "2" or tool_type == "3":
        if form.has_key('data_1') :
            if form.getvalue('data_1') == "" :
                message = "No key"
        elif form.has_key('log_file') :
            if form.getvalue('log_file') == "" :
                message = "No Log File"
        elif form.has_key('input_file_1') :
            if form.getvalue('input_file_1') == "" :
                message = "No Input File 1"
        elif form.has_key('output_file') :
            if form.getvalue('output_file') == "" :
                message = "No Output File"
        elif form.has_key('time_zone') :
            if form.getvalue('time_zone') == "" :
                message = "No Time Zone"
        elif form.has_key("sample_name"):
            if form.getvalue("sample_name")=="" :
                message = "No sampple Name"
        elif form.has_key('read_group') == "" :
            if form.has_key('read_group') :
                message = "No Read Group"
        elif form.has_key('platform') == "" :
            if form.has_key('platform') :
                message = "No Platform"

        if message == "" and state1 == 1:
            str_data_1 = form.getvalue("data_1")
            log_file = form.getvalue("log_file")
            
            input_file_1 = form.getvalue("input_file_1")
            input_file_2 = form.getvalue("input_file_2")
            sample_name = form.getvalue("sample_name")
            read_group = form.getvalue("read_group")
            platform = form.getvalue("platform")

            output_file = form.getvalue("output_file")
            image_file = form.getvalue("image_file")
            time_zone = form.getvalue("time_zone")
            fn = form.getvalue("fn")
            environment="/var/www/cgi-bin/tmp/"+fn
            os.putenv("GOOGLE_APPLICATION_CREDENTIALS", environment)
            os.putenv("sample", sample_name)

            if tool_type == "2":
                cmd2 = 'dsub  --project ' + str_data_1 + ' --min-cores 1 --min-ram 7.5 --preemptible \
                        --boot-disk-size 20 --disk-size 200  --zones ' + time_zone + ' \
                        --logging '+ log_file + ' --input FASTQ_1=' + input_file_1 +  ' --input FASTQ_2=' + input_file_2 + ' \
                        --output UBAM=' + output_file + ' --env SM=${sample}  --image broadinstitute/gatk:4.1.0.0  \
                        --env RG=' + read_group  + '\
                        --env PL=' + platform    + '\
                        --command \'/gatk/gatk --java-options "-Xmx8G -Djava.io.tmpdir=bla" \
                        FastqToSam -F1 ${FASTQ_1} -F2 ${FASTQ_2} -O ${UBAM} --SAMPLE_NAME ${SM} -RG ${RG} -PL ${PL} \''
                output1 = subprocess.check_output(cmd2, stderr=subprocess.STDOUT, shell=True)
                message="Successful Submit FastqToSam"
            
            else:
                cmd2 = 'dsub  --project ' + str_data_1 + ' --min-cores 1 --min-ram 32 --preemptible \
                        --boot-disk-size 50 --disk-size 500  --zones ' + time_zone + ' \
                        --logging '+ log_file + ' --input FASTQ_1=' + input_file_1 +  ' --input FASTQ_2=' + input_file_2 + ' \
                        --output UBAM=' + output_file + ' --env SM=${sample} --image broadinstitute/gatk:4.1.0.0   \
                        --env RG=' + read_group  + '\
                        --env PL=' + platform    + '\
                        --command \'/gatk/gatk --java-options "-Xmx8G -Djava.io.tmpdir=bla" \
                        FastqToSam -F1 ${FASTQ_1} -F2 ${FASTQ_2} -O ${UBAM} --SAMPLE_NAME ${SM} -RG ${RG} -PL ${PL} \''
                output1 = subprocess.check_output(cmd2, stderr=subprocess.STDOUT, shell=True)
                message="Successful Submit FastqToSam > 50G"

    elif tool_type == "4":
        
            cmd3 = 'dstat --project '+str_data_1+' --provider google-v2  --jobs '+output1[4:42]+' --state "*"'
            output2 = commands.getoutput(cmd3)
            state1=1
        
if message == "":
    message="Still Login"
    fn=form.getvalue("fn")

tools.print_head(str_data_1,fn, message)

print '             <div class="nav nav-pills text-center" id="v-pills-tab" >'

print '	                    <a class="nav-link active mr-md-2" id="v-pills-1-tab" data-toggle="pill" href="#v-pills-1" role="tab" aria-controls="v-pills-1" aria-selected="true">FastqToSam</a>'	    

print '	                    <a class="nav-link" id="v-pills-3-tab" data-toggle="pill" href="#v-pills-3" role="tab" aria-controls="v-pills-3" aria-selected="false">FastqToSam > 50 G</a>'	    

print '	                    <a class="nav-link" id="v-pills-4-tab" data-toggle="pill" href="#v-pills-4" role="tab" aria-controls="v-pills-4" aria-selected="false">GATK</a>'	    
print '	                    <a class="nav-link" id="v-pills--5tab"  href="https://github.com/StanfordBioinformatics/gatk-mvp"  aria-selected="false">Detail Introduction</a>'	    



print '             </div>'
print '	        </div>'
print '		<div class="col-md-12 tab-wrap">'
print '             <div class="tab-content p-4" id="v-pills-tabContent">'
print '                 <div class="tab-pane fade show active" id="v-pills-1" role="tabpanel" aria-labelledby="v-pills-performance-tab">'
    
if state1==1:
    print '<form enctype="multipart/form-data" action="/cgi-bin/backend_get.py"  method="post"><div class=" no-gutters">'
    print '     <div class="col-md mr-md-2">'
    print '             <div class="form-field">'
    #print '                     <input type="text" name="time_zone" class="form-control" placeholder="Time Zone. eg. us-*. ">'
    print '\
        <select name="time_zone" id="Menu" style="max-width:200%;">\
            <option value="us-*">   Time Zone : .eg us-*   </option>\
            <option value="us-central1-a">us-central1-a</option>\
            <option value="us-central1-b">us-central1-b</option>\
            <option value="us-central1-c">us-central1-c</option>\
            <option value="us-central1-f">us-central1-f</option>\
            <option value="us-east1-b">us-east1-b</option>\
            <option value="us-east1-c">us-east1-c</option>\
            <option value="us-east1-d">us-east1-d</option>\
            <option value="us-east4-a">us-east4-a</option>' 
    print '<option value="us-east4-b">us-east4-b</option>'
    print '<option value="us-east4-c">us-east4-c</option>'
    print '<option value="us-west1-a">us-west1-a</option>'
    print '<option value="us-west1-b">us-west1-b</option>'
    print '<option value="us-west1-c">us-west1-c</option>'
    print '<option value="us-west2-a">us-west2-a</option>'
    print '<option value="us-west2-b">us-west2-b</option>'
    print '</select>'
    print '             </div>'
    print '     </div>'
    print '	<br>'
    print '	<div class="col-md mr-md-2">'
    print '     <div class="form-field">'
    print '     <input type="text" name="log_file" class="form-control" placeholder="Log File. eg. gs://genomics-public-data/logs. ">'
    print '     </div>'
    print '     </div>'
    print '     <br>'	    
    print '<div class="col-md mr-md-2">'
    print '<div class="form-group">'
    print '<div class="form-field">'
    print '<input type="text" name="sample_name" class="form-control" placeholder="sample_name. eg. fastq ">'
    print '</div>'
    print '</div>'
    print '</div>'
    print '<div class="col-md mr-md-2">'
    print '<div class="form-group">'
    print '<div class="form-field">'
    print '<input type="text" name="read_group" class="form-control" placeholder="Read Group. eg. RG0 ">'
    print '</div>'
    print '</div>'
    print '</div>'
    print '<div class="col-md mr-md-2">'
    print '<div class="form-group">'
    print '<div class="form-field">'
    print '<input type="text" name="platform" class="form-control" placeholder="Platform. eg. illumina ">'
    print '</div>'
    print '</div>'
    print '</div>'
    print '<div class="col-md mr-md-2">'
    print '<div class="form-group">'
    print '<div class="form-field">'
    print '<input type="text" name="input_file_1" class="form-control" placeholder="Input File 1. eg. gs://genomics-public-data/platinum-genomes/fastq/ERR194159_1.fastq.gz. ">'
    print '</div>'
    print '</div>'
    print '</div>'
    print '<div class="col-md mr-md-2">'
    print '<div class="form-group">'
    print '<div class="form-field">'
    print '<input type="text" name="input_file_2" class="form-control" placeholder="Input File 2. eg. gs://genomics-public-data/platinum-genomes/fastq/ERR194159_2.fastq.gz ">'
    print '</div>'
    print '</div>'
    print '</div>'

    print '<div class="col-md mr-md-2">'
    print '<div class="form-group">'
    print '<div class="form-field">'
    print '<input type="text" name="output_file" class="form-control" placeholder="Output File. eg. gs://genomics-public-data/out/fastq/ERR194159_out. ">'
    print '</div>'
    print '</div>'
    print '</div>'
    print '<input type="hidden" name="data_1" value="' + str_data_1 + '">'
    print '<input type="hidden" name="type_file" value="2">'
    print '<input type="hidden" name="tool_type" value="2">'
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
    print '</form></div>'

    print '<div class="tab-pane fade" id="v-pills-3" role="tabpanel" aria-labelledby="v-pills-performance-tab">'
    print '<form enctype="multipart/form-data" action="/cgi-bin/backend_get.py"  method="post"><div class=" no-gutters">'
    print '     <div class="col-md mr-md-2">'
    print '             <div class="form-field">'
    #print '                     <input type="text" name="time_zone" class="form-control" placeholder="Time Zone. eg. us-*. ">'
    print '\
        <select name="time_zone" id="Menu" style="max-width:200%;">\
            <option value="us-*">   Time Zone : .eg us-*   </option>\
            <option value="us-central1-a">us-central1-a</option>\
            <option value="us-central1-b">us-central1-b</option>\
            <option value="us-central1-c">us-central1-c</option>\
            <option value="us-central1-f">us-central1-f</option>\
            <option value="us-east1-b">us-east1-b</option>\
            <option value="us-east1-c">us-east1-c</option>\
            <option value="us-east1-d">us-east1-d</option>\
            <option value="us-east4-a">us-east4-a</option>' 
    print '<option value="us-east4-b">us-east4-b</option>'
    print '<option value="us-east4-c">us-east4-c</option>'
    print '<option value="us-west1-a">us-west1-a</option>'
    print '<option value="us-west1-b">us-west1-b</option>'
    print '<option value="us-west1-c">us-west1-c</option>'
    print '<option value="us-west2-a">us-west2-a</option>'
    print '<option value="us-west2-b">us-west2-b</option>'
    print '</select>'
    print '             </div>'
    print '     </div>'
    print '	<br>'
    print '	<div class="col-md mr-md-2">'
    print '     <div class="form-field">'
    print '     <input type="text" name="log_file" class="form-control" placeholder="Log File. eg. gs://genomics-public-data/logs. ">'
    print '     </div>'
    print '     </div>'
    print '     <br>'	    
    print '<div class="col-md mr-md-2">'
    print '<div class="form-group">'
    print '<div class="form-field">'
    print '<input type="text" name="sample_name" class="form-control" placeholder="sample_name. eg. fastq ">'
    print '</div>'
    print '</div>'
    print '</div>'
    print '<div class="col-md mr-md-2">'
    print '<div class="form-group">'
    print '<div class="form-field">'
    print '<input type="text" name="read_group" class="form-control" placeholder="Read Group. eg. RG0 ">'
    print '</div>'
    print '</div>'
    print '</div>'
    print '<div class="col-md mr-md-2">'
    print '<div class="form-group">'
    print '<div class="form-field">'
    print '<input type="text" name="platform" class="form-control" placeholder="Platform. eg. illumina ">'
    print '</div>'
    print '</div>'
    print '</div>'
    print '<div class="col-md mr-md-2">'
    print '<div class="form-group">'
    print '<div class="form-field">'
    print '<input type="text" name="input_file_1" class="form-control" placeholder="Input File 1. eg. gs://genomics-public-data/platinum-genomes/fastq/ERR194159_1.fastq.gz. ">'
    print '</div>'
    print '</div>'
    print '</div>'
    print '<div class="col-md mr-md-2">'
    print '<div class="form-group">'
    print '<div class="form-field">'
    print '<input type="text" name="input_file_2" class="form-control" placeholder="Input File 2. eg. gs://genomics-public-data/platinum-genomes/fastq/ERR194159_2.fastq.gz ">'
    print '</div>'
    print '</div>'
    print '</div>'

    print '<div class="col-md mr-md-2">'
    print '<div class="form-group">'
    print '<div class="form-field">'
    print '<input type="text" name="output_file" class="form-control" placeholder="Output File. eg. gs://genomics-public-data/out/fastq/ERR194159_out. ">'
    print '</div>'
    print '</div>'
    print '</div>'
    print '<input type="hidden" name="data_1" value="' + str_data_1 + '">'
    print '<input type="hidden" name="type_file" value="2">'
    print '<input type="hidden" name="tool_type" value="3">'
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
    print '</form></div>'

    print '<div class="tab-pane fade" id="v-pills-4" role="tabpanel" aria-labelledby="v-pills-performance-tab">'
    print '<form enctype="multipart/form-data" action="/cgi-bin/backend_get.py"  method="post"><div class=" no-gutters">'
    print '     <div class="col-md mr-md-2">'
    print '             <div class="form-field">'
    #print '                     <input type="text" name="time_zone" class="form-control" placeholder="Time Zone. eg. us-*. ">'
    print '\
        <select name="time_zone" id="Menu" style="max-width:200%;">\
            <option value="us-*">   Time Zone : .eg us-*   </option>\
            <option value="us-central1-a">us-central1-a</option>\
            <option value="us-central1-b">us-central1-b</option>\
            <option value="us-central1-c">us-central1-c</option>\
            <option value="us-central1-f">us-central1-f</option>\
            <option value="us-east1-b">us-east1-b</option>\
            <option value="us-east1-c">us-east1-c</option>\
            <option value="us-east1-d">us-east1-d</option>\
            <option value="us-east4-a">us-east4-a</option>' 
    print '<option value="us-east4-b">us-east4-b</option>'
    print '<option value="us-east4-c">us-east4-c</option>'
    print '<option value="us-west1-a">us-west1-a</option>'
    print '<option value="us-west1-b">us-west1-b</option>'
    print '<option value="us-west1-c">us-west1-c</option>'
    print '<option value="us-west2-a">us-west2-a</option>'
    print '<option value="us-west2-b">us-west2-b</option>'
    print '</select>'
    print '             </div>'
    print '     </div>'
    print '	<br>'
    print '<div class="col-md mr-md-2">'
    print '<div class="form-group">'
    print '<div class="form-field">'
    print '<input type="text" name="sample_name" class="form-control" placeholder="sample_name. eg. fastq ">'
    print '</div>'
    print '</div>'
    print '</div>'
    print '<div class="col-md mr-md-2">'
    print '<div class="form-group">'
    print '<div class="form-field">'
    print '<input type="text" name="bucket" class="form-control" placeholder="Bucket Name for GCP storage. eg. gatk-sample">'
    print '</div>'
    print '</div>'
    print '</div>'

    print '<div class="col-md mr-md-2">'
    print '<div class="form-group">'
    print '<div class="form-field">'
    print '<input type="text" name="input_file_1" class="form-control" placeholder="Input File 1. eg. gs://genomics-public-data/platinum-genomes/fastq/test.bam ">'
    print '</div>'
    print '</div>'
    print '</div>'
    print '<div class="col-md mr-md-2">'
    print '<div class="form-group">'
    print '<div class="form-field">'
    print '<input type="text" name="input_file_2" class="form-control" placeholder="Input File 2. eg. gs://genomics-public-data/platinum-genomes/fastq/test_2.bam ">'
    print '</div>'
    print '</div>'
    print '</div>'

    print '<input type="hidden" name="data_1" value="' + str_data_1 + '">'
    print '<input type="hidden" name="type_file" value="2">'
    print '<input type="hidden" name="tool_type" value="1">'
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
    print '</form></div>'


tools.print_back()

