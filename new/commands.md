### FastqToSam

#### Params:
```bash
{ GOOGLE_CRED_FILE_PATH: '/Users/li/_CODE_/wings-SCGPM/new/credentials/850af0f0-ca97-11e9-a74d-7f966956fa0b.json',
  region: 'us-central1',
  log_file: 'gs://gbsc-gcp-project-annohive-dev-user-lektin/fastqtosam/logging',
  sample_name: 'ERR250256',
  read_group: 'RG0',
  platform: 'illumina',
  input_file_1: 'gs://genomics-public-data/gatk-examples/example1/NA19913/ERR250256_1.filt.fastq.gz',
  input_file_2: 'gs://genomics-public-data/gatk-examples/example1/NA19913/ERR250256_2.filt.fastq.gz',
  output_file: 'gs://gbsc-gcp-project-annohive-dev-user-lektin/fastqtosam/output/ERR250256.bam',
  project_id: 'gbsc-gcp-project-annohive-dev'
}
```
#### Commands:
```bash
export GOOGLE_APPLICATION_CREDENTIALS=/Users/li/_CODE_/wings-SCGPM/new/credentials/850af0f0-ca97-11e9-a74d-7f966956fa0b.json &&   dsub  --project gbsc-gcp-project-annohive-dev --min-cores 1 --min-ram 7.5   --preemptible --boot-disk-size 20 --disk-size 200  --regions us-central1   --logging gs://gbsc-gcp-project-annohive-dev-user-lektin/fastqtosam/logging --input FASTQ_1=gs://genomics-public-data/gatk-examples/example1/NA19913/ERR250256_1.filt.fastq.gz --input FASTQ_2=gs://genomics-public-data/gatk-examples/example1/NA19913/ERR250256_2.filt.fastq.gz   --output UBAM=gs://gbsc-gcp-project-annohive-dev-user-lektin/fastqtosam/output/ERR250256.bam --env SM=ERR250256    --image broadinstitute/gatk:4.1.0.0 --env RG=RG0 --env PL=illumina   --command '/gatk/gatk --java-options "-Xmx8G -Djava.io.tmpdir=bla" FastqToSam -F1 ${FASTQ_1} -F2 ${FASTQ_2} -O ${UBAM} --SAMPLE_NAME ${SM} -RG ${RG} -PL ${PL}'
```
#### Job id:
`gatk--li--190829-130150-06`
---
### GATK
#### Params:
```bash
{
  GOOGLE_CRED_FILE_PATH: '/Users/li/_CODE_/wings-SCGPM/new/credentials/54ae42d0-caa2-11e9-b639-9138d7fe090c.json',
  region: 'us-central1',
  bucket_name: 'gbsc-gcp-project-annohive-dev-user-lektin',
  sample_name: 'ERR250256',
  input_file_1: 'gs://gbsc-gcp-project-annohive-dev-user-lektin/fastqtosam/output/ERR250256.bam',
  input_file_2: null,
  project_id: 'gbsc-gcp-project-annohive-dev'
}
```
#### Commands:
```bash
gsutil cp -r /Users/li/_CODE_/wings-SCGPM/new/setting-files/gatk-mvp/gatk-mvp-pipeline/ gs://gbsc-gcp-project-annohive-dev-user-lektin &&     gsutil cp /Users/li/_CODE_/wings-SCGPM/new/temp/1567113425265/ERR250256.hg38.inputs.json gs://gbsc-gcp-project-annohive-dev-user-lektin/ERR250256/ &&     export GOOGLE_APPLICATION_CREDENTIALS=/Users/li/_CODE_/wings-SCGPM/new/credentials/54ae42d0-caa2-11e9-b639-9138d7fe090c.json &&     dsub       --provider google-v2       --project gbsc-gcp-project-annohive-dev       --regions us-central1       --min-cores 1       --min-ram 6.5       --image 'jinasong/wdl_runner:latest'       --logging gs://gbsc-gcp-project-annohive-dev-user-lektin/ERR250256/logging       --input CFG=gs://gbsc-gcp-project-annohive-dev-user-lektin/gatk-mvp-pipeline/google-adc.conf       --input OPTION=gs://gbsc-gcp-project-annohive-dev-user-lektin/gatk-mvp-pipeline/generic.google-papi.options.json       --input WDL=gs://gbsc-gcp-project-annohive-dev-user-lektin/gatk-mvp-pipeline/fc_germline_single_sample_workflow.wdl       --input SUBWDL="gs://gbsc-gcp-project-annohive-dev-user-lektin/gatk-mvp-pipeline/tasks_pipelines/*.wdl"       --input INPUT=gs://gbsc-gcp-project-annohive-dev-user-lektin/ERR250256/ERR250256.hg38.inputs.json       --env MYproject=gbsc-gcp-project-annohive-dev       --env ROOT=gs://gbsc-gcp-project-annohive-dev-user-lektin/ERR250256/output       --command 'java -Dconfig.file=${CFG} -Dbackend.providers.JES.config.project=${MYproject} -Dbackend.providers.JES.config.root=${ROOT} -jar /cromwell/cromwell.jar run ${WDL} --inputs ${INPUT} --options ${OPTION}' &&    rm -rf /Users/li/_CODE_/wings-SCGPM/new/temp/1567113425265
```
#### Job id:
`java--li--190829-141718-86`