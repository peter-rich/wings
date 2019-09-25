#!/bin/bash
## GCP log-in
gcloud beta compute ssh --project gbsc-gcp-project-annohive-dev --zone us-central1-a wings-transition-lek

## GCP copy
gcloud compute scp authentication-server:/var/www/cgi-bin/backend_get.py ~/_CODE_/wings-SCGPM

## Fastq To Sam


## VCF Import
### Step 1: create VCFList
export GOOGLE_APPLICATION_CREDENTIALS=/Users/li/_CODE_/wings-SCGPM/app/credentials/e0afafd0-d416-11e9-982c-37e2ae65ac76.json && \
dsub \
  --provider google-v2 \
  --project gbsc-gcp-project-annohive-dev \
  --logging gs://gbsc-gcp-project-annohive-dev-user-lektin/AnnotationHive/logs/ \
  --regions us-central1 \
  --command "mvn compile exec:java \
      -Dexec.mainClass=com.google.cloud.genomics.cba.StartAnnotationHiveEngine \
      -Dexec.args='ImportVCFFromGCSToBigQuery \
      --project=gbsc-gcp-project-annohive-dev \
      --stagingLocation=gs://gbsc-gcp-project-annohive-dev-user-lektin/AnnotationHive/staging/ \
      --bigQueryDatasetId=AnnotationHive \
      --runner=DataflowRunner \
      --createVCFListTable=true' \
    -Pdataflow-runner" \
  --image annotationhive/annotationhive_public:0.1 \
  --min-ram 40 \
  --min-cores 2
### Step 2: Import VCF file
mvn compile exec:java \
  -Dexec.mainClass=com.google.cloud.genomics.cba.StartAnnotationHiveEngine \
  -Dexec.args="ImportVCFFromGCSToBigQuery  \
    --project=gbsc-gcp-project-annohive-dev  \
    --stagingLocation=gs://gbsc-gcp-project-annohive-dev-user-lektin/AnnotationHive/staging  \
    --bigQueryDatasetId=AnnotationHive \
    --header=CHROM,POS,ID,REF,ALT,QUAL,FILTER,INFO,FORMAT,NA12877  \
    --columnOrder=1,2,2,4,5  \
    --base0=no  \
    --bigQueryVCFTableId=NA12877_chr17_Lek  \
    --VCFInputTextBucketAddr=gs://gbsc-gcp-project-annohive-dev-user-lektin/AnnotationHive/NA12877-chr17.vcf  \
    --VCFVersion=1.0  \
    --assemblyId=hg19  \
    --columnSeparator=\t  \
    --POS=true \
    --runner=DataflowRunner" \
  -Pdataflow-runner


## Variant-based annotate VCF
# 1) change gbsc-gcp-project-cba:AnnotationHive_public => gbsc-gcp-project-cba:AnnotationHive_hg19
# 2) no --createVCF=true 
# 3) --build=hg19 (edited) 
# 4) add --project=   --projectId=
# also, you should remove VCF_NA12877_chr17_Test_Lek_Output
# can you check before running the code if the output table exists VCF_NA12877_chr17_Test_Lek_Output?
mvn compile exec:java \
  -Dexec.mainClass=com.google.cloud.genomics.cba.StartAnnotationHiveEngine \
  -Dexec.args="BigQueryAnnotateVariants   \
    --projectId=gbsc-gcp-project-annohive-dev   \
    --project=gbsc-gcp-project-annohive-dev   \
    --bigQueryDatasetId=AnnotationHive        \
    --outputBigQueryTable=VCF_NA12877_chr17_Test_Lek_Output       \
    --variantAnnotationTables=gbsc-gcp-project-cba:AnnotationHive_hg19.hg19_Cosmic70:ID  \
    --VCFTables=gbsc-gcp-project-annohive-dev:AnnotationHive.NA12877_chr17_Lek  \
    --build=hg19   \
    --stagingLocation=gs://gbsc-gcp-project-annohive-dev-user-lektin/AnnotationHive/staging \
    --runner=DataflowRunner" \
  -Pdataflow-runner