## AnnotationHive
1. AnnotationHive Process
```bash
mvn compile exec:java     -Dexec.mainClass=com.google.cloud.genomics.cba.StartAnnotationHiveEngine     -Dexec.args="BigQueryAnnotateVariants       --projectId=gbsc-gcp-project-annohive-dev       --bigQueryDatasetId=AnnotationHive        --outputBigQueryTable=VCF_NA12877_chr17_Test_lek_output       --variantAnnotationTables=gbsc-gcp-project-cba:AnnotationHive_hg19.hg19_Cosmic70:ID  --VCFTables=gbsc-gcp-project-annohive-dev:AnnotationHive.VCF_NA12877_chr17_Test    --build=hg19   --stagingLocation=gs://gbsc-gcp-project-annohive-dev-user-lektin/AnnotationHive/staging   --runner=DataflowRunner" -Pdataflow-runner
```

2. a comma between every database and it's field: 
```bash
--variantAnnotationTables=gbsc-gcp-project-cba:AnnotationHive_Public.GRCh37_Wellderly_wellderly_all_vcf:FILTER:INFO,gbsc-gcp-project-cba:AnnotationHive_Public.hg19_dann:Dann_Score
gbsc-gcp-project-cba:AnnotationHive_Public.GRCh37_Wellderly_wellderly_all_vcf  => field: INFO and FILTER
```

3. why are using `gbsc-gcp-project-annohive-dev:falcon.hg19_acmg_genes`?
I gave you access to the **actual annotations**??

4. pay attention to, colons and commas and dots
`gbsc-gcp-project-cba:AnnotationHive_hg19.hg19_Cosmic70:ID`

5. AnnotationHive import - to create a `VCFList` table
```bash
mvn compile exec:java -Dexec.mainClass=com.google.cloud.genomics.cba.StartAnnotationHiveEngine       -Dexec.args='ImportVCFFromGCSToBigQuery       --project=gbsc-gcp-project-annohive-dev       --stagingLocation=gs://gbsc-gcp-project-annohive-dev-user-lektin/AnnotationHive/staging/  --bigQueryDatasetId=AnnotationHive       --runner=DataflowRunner       --createVCFListTable=true'     -Pdataflow-runner
```

6. Parameters
`VCFCanonicalizeRefNames`, `bucketAddrAnnotatedVCF`