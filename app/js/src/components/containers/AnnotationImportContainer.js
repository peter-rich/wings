import React, { Component } from 'react'
import Form from './Form'
import { API_ROUTES, REGIONS } from '../../constants'

const title = 'AnnotationHive VCF Import'
const fields = [
  [
    {
      key: 'region',
      defaultValue: 'us-central1',
      type: 'dropdown',
      options: REGIONS,
      title: 'Region',
      rules: ['required'],
    },
    {
      key: 'logs_path',
      title: 'Path to log files, for example, "gs://your_bucket/project_id/logs"',
      type: 'text',
      rules: ['required', 'gsLink']
    },
    {
      key: 'staging_address',
      title: 'Staging address, for example, "gs://your_bucket/AnnotationHive/staging"',
      type: 'text',
      rules: ['required', 'gsLink']
    },
    {
      key: 'bigQueryDatasetId',
      title: 'BigQuery DatasetId, for example, "AnnotationHive"',
      type: 'text',
      rules: ['required']
    },
    {
      key: 'headers',
      title: 'Header values, separated by commas. for example, "CHROM,POS,ID,REF,ALT,QUAL,FILTER,INFO,FORMAT,NA12877"',
      type: 'text',
      rules: ['required']
    },
    {
      key: 'columnOrder',
      title: 'Column order, separated by commas. for example, "1,2,2,4,5"',
      type: 'text',
      rules: ['required']
    },
    {
      key: 'bigQueryVCFTableId',
      title: 'BigQuery VCF Table ID, for example, "NA12877_chr17"',
      type: 'text',
      rules: ['required']
    },
    {
      key: 'VCFInputTextBucketAddr',
      title: 'Path to VCF Input Text, for example, "gs://<YOUR_Google_Bucket_Name>/NA12877-chr17.vcf"',
      type: 'text',
      rules: ['required', 'gsLink', 'vcfFile']
    },
    {
      key: 'build',
      type: 'radio',
      title: 'Build type',
      rules: ['required'],
      options: [
        { key: 'hg19', displayName: 'HG19' },
        { key: 'hg38', displayName: 'HG38' }
      ],
      defaultValue: 'hg19',
    }
  ]
]


// createVCFListTable

class AnnotationImportContainer extends Component {
  render() {
    return (
      <Form title={title}
        fields={fields}
        API_ROUTE={API_ROUTES.ANNOTATION_IMPORT}
      />
    )
  }
}

export default AnnotationImportContainer