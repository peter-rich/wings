dsub  --project gbsc-gcp-project-annohive-dev --min-cores 1 --min-ram 7.5 --preemptible --boot-disk-size 20 --disk-size 200  --zones us-east1-b --logging gs://gbsc-gcp-project-annohive-dev-user-lektin/logging --input FASTQ_1=gs://genomics-public-data/gatk-examples/example1/NA19913/ERR250256_1.filt.fastq.gz --input FASTQ_2=gs://genomics-public-data/gatk-examples/example1/NA19913/ERR250256_2.filt.fastq.gz --output UBAM=gs://gbsc-gcp-project-annohive-dev-user-lektin/output/cli-test.out --env SM=${sample}  --image broadinstitute/gatk:4.1.0.0  --env RG=RG0 --env PL=illumina --command '/gatk/gatk --java-options "-Xmx8G -Djava.io.tmpdir=bla" FastqToSam -F1 ${FASTQ_1} -F2 ${FASTQ_2} -O ${UBAM} --SAMPLE_NAME ${SM} -RG ${RG} -PL ${PL}'

To check the status, run:
dstat --provider google-v2 --project gbsc-gcp-project-annohive-dev --jobs 'gatk--lektin-stanford-edu--190821-000637-02' --users 'lektin-stanford-edu' --status '*'
To cancel the job, run:
  ddel --provider google-v2 --project gbsc-gcp-project-annohive-dev --jobs 'gatk--lektin-stanford-edu--190821-000637-02' --users 'lektin-stanford-edu'
gatk--lektin-stanford-edu--190821-000637-0



gcloud beta compute ssh --project gbsc-gcp-project-annohive-dev --zone us-central1-a wings-transition-lek