#!/bin/bash
project_id=$0
time_zone=$1
log_file=$2
input_file_1=$3
input_file_2=$4
output_file=$5
sample_name=$6
read_group=$7
platform=$8
cmd=(dsub  --project $project_id --min-cores 1 --min-ram 7.5 --preemptible \
--boot-disk-size 20 --disk-size 200  --zones $time_zone --logging $log_file \
--input FASTQ_1=$input_file_1 --input FASTQ_2=$input_file_2 --output UBAM=$output_file \
--env SM=${sample_name} --image broadinstitute/gatk:4.1.0.0 --env RG=${read_group} \
--env PL=illumina --command '/gatk/gatk --java-options "-Xmx8G -Djava.io.tmpdir=bla" FastqToSam \
-F1 ${FASTQ_1}-F2 ${FASTQ_2} -O ${UBAM} --SAMPLE_NAME ${SM} -RG ${RG} -PL ${PL}')
cd ./local/dsub-master
virtualenv --python=python2.7 dsub_libs
source dsub_libs/bin/activate
pip install dsub
dsub
cd ../../
export GOOGLE_APPLICATION_CREDENTIALS=/Users/li/_CODE_/wings-SCGPM/new/local/gbsc-gcp-project-annohive-dev-2817dc37f2ed.json
echo $GOOGLE_APPLICATION_CREDENTIALS
echo $project_id
echo $time_zone
echo $log_file
echo $input_file_1
echo $input_file_2
echo $output_file
echo $sample_name
echo $platform
echo $read_group
"${cmd[@]}"
deactivate
exit
# dsub  --project $projectID --min-cores 1 --min-ram 7.5 --preemptible \
# --boot-disk-size 20 --disk-size 200  --zones us-east1-b --logging \
# $log_file --input FASTQ_1=$input_file_1 --input FASTQ_2=$input_file_2 \
# --output UBAM=$output_file --env SM=abc --image broadinstitute/gatk:4.1.0.0  --env RG=RG0 --env PL=illumina \
# --command '/gatk/gatk --java-options "-Xmx8G -Djava.io.tmpdir=bla" FastqToSam -F1 ${FASTQ_1} \
# -F2 ${FASTQ_2} -O ${UBAM} --SAMPLE_NAME ${SM} -RG ${RG} -PL ${PL}'





# To check the status, run:
#   dstat --provider google-v2 --project gbsc-gcp-project-annohive-dev --jobs 'gatk--li--190821-182137-12' --users 'li' --status '*'

# To cancel the job, run:
#   ddel --provider google-v2 --project gbsc-gcp-project-annohive-dev --jobs 'gatk--li--190821-182137-12' --users 'li'

# gatk--li--190821-182137-12