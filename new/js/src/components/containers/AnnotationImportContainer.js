import React, { Component } from 'react'
import Form from './Form'
import { API_ROUTES } from '../../constants'

const title = 'AnnotationHive Import'
const fields = [
  {
    key: 'region',
    title: 'Region',
    required: true
  },
  {
    key: 'logs_path',
    title: 'Path to log files, for example, "gs://your_bucket/project_id/logs"',
    required: true
  },
  {
    key: 'staging_address',
    title: 'Staging address, for example, "gs://your_bucket/AnnotationHive/staging"',
    required: true
  },
  {
    key: 'google_genomics_datasetid',
    title: 'Google Genomics DatasetId, for example, "bigquery-public-data:human_genome_variants"',
    required: true
  },
  {
    key: 'headers',
    title: 'Header values, separated by commas. for example, "CHROM,POS,ID,REF,ALT,QUAL,FILTER,INFO,FORMAT,NA12877"',
    required: true
  },
  {
    key: 'column_order',
    title: 'Column order, separated by commas. for example, "1,2,2,4,5"',
    required: true
  },
  {
    key: 'bigQueryVCFTableId',
    title: 'BigQuery VCF Table ID, for example, "NA12877_chr17"',
    required: true
  },
  {
    key: 'VCFInputTextBucketAddr',
    title: 'Path to VCF Input Text, for example, "gs://<YOUR_Google_Bucket_Name>/NA12877-chr17.vcf"',
    required: true
  },
  {
    key: 'assembly_id',
    title: 'Assembly ID, for example, "hg19"',
    required: true
  },
  {
    key: 'sampleIDs',
    title: 'Sample IDs, for example, "RWGS_10_N,RWGS_5_T,RWGS_6_N,RWGS_8_N,RWGS_9_T,WGS_1_T,WGS_2_N,WGS_3_T,WGS_4_N,WGS_7_T"',
    required: true
  },
]


class CNVnator extends Component {
  render() {
    return (
      <Form title={title}
        fields={fields}
        API_ROUTE={API_ROUTES.ANNOTATION_IMPORT}
      />
    )
  }
}

export default CNVnator