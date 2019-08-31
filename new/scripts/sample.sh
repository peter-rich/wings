dsub  --project gbsc-gcp-project-annohive-dev --min-cores 1 --min-ram 7.5 --preemptible --boot-disk-size 20 --disk-size 200  --zones us-east1-b --logging gs://gbsc-gcp-project-annohive-dev-user-lektin/logging --input FASTQ_1=gs://genomics-public-data/gatk-examples/example1/NA19913/ERR250256_1.filt.fastq.gz --input FASTQ_2=gs://genomics-public-data/gatk-examples/example1/NA19913/ERR250256_2.filt.fastq.gz --output UBAM=gs://gbsc-gcp-project-annohive-dev-user-lektin/output/cli-test.out --env SM=${sample}  --image broadinstitute/gatk:4.1.0.0  --env RG=RG0 --env PL=illumina --command '/gatk/gatk --java-options "-Xmx8G -Djava.io.tmpdir=bla" FastqToSam -F1 ${FASTQ_1} -F2 ${FASTQ_2} -O ${UBAM} --SAMPLE_NAME ${SM} -RG ${RG} -PL ${PL}'

To check the status, run:
dstat --provider google-v2 --project gbsc-gcp-project-annohive-dev --jobs 'gatk--lektin-stanford-edu--190821-000637-02' --users 'lektin-stanford-edu' --status '*'
To cancel the job, run:
  ddel --provider google-v2 --project gbsc-gcp-project-annohive-dev --jobs 'gatk--lektin-stanford-edu--190821-000637-02' --users 'lektin-stanford-edu'
gatk--lektin-stanford-edu--190821-000637-0



gcloud beta compute ssh --project gbsc-gcp-project-annohive-dev --zone us-central1-a wings-transition-lek

gcloud compute scp authentication-server:/var/www/cgi-bin/backend_get.py ~/_CODE_/wings-SCGPM



# - create-time: '2019-08-22 00:46:47.583895'
  # end-time: '2019-08-22 01:19:23.213015'
  # job-id: gatk--li--190822-004646-47
  # job-name: gatk
  # logging: gs://gbsc-gcp-project-annohive-dev-user-lektin/logging/gatk--li--190822-004646-47.log
  # status: SUCCESS
# - create-time: '2019-08-21 18:21:37.954801'
  # end-time: '2019-08-21 18:29:52.292039'
  # job-id: gatk--li--190821-182137-12
  # job-name: gatk
  # logging: gs://gbsc-gcp-project-annohive-dev-user-lektin/logging/gatk--li--190821-182137-12.log
  # status: FAILURE
# - create-time: '2019-08-21 17:23:22.965318'
  # end-time: '2019-08-21 17:26:37.934986'
  # job-id: gatk--li--190821-172322-25
  # job-name: gatk
  # logging: gs://gbsc-gcp-project-annohive-dev-user-lektin/logging/gatk--li--190821-172322-25.log
  # status: FAILURE
# - create-time: '2019-08-21 17:20:59.170356'
  # end-time: '2019-08-21 17:22:05.721823'
  # job-id: gatk--li--190821-172058-44
  # job-name: gatk
  # logging: gs://gbsc-gcp-project-annohive-dev-user-lektin/logging/gatk--li--190821-172058-44.log
  # status: FAILURE