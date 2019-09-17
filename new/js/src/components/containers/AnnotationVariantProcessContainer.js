import React, { Component } from 'react'
import Form from './Form'
import { API_ROUTES } from '../../constants'

const title = 'Annotation Process(Variant Based)'
const fields = [
  {
    key: 'region',
    defaultValue: 'us-central1',
    type: 'dropdown',
    title: 'Region',
    rules: ['required'],
  },
  {
    key: 'logs_path',
    type: 'text',
    title: 'Path to log files, for example, "gs://your_bucket/project_id/logs"',
    rules: ['required', 'gsLink'],
  },
  {
    key: 'stagingLocation',
    type: 'text',
    title: 'Staging Location, for example, "gs://<BUCKET_ID>/AnnotationHive/staging/"',
    rules: ['required', 'gsLink'],
  },
  {
    key: 'bigQueryDatasetId',
    type: 'text',
    title: 'BigQuery DatasetID that will contain the output annotated VCF table, for example, "sample_dataset_id"',
    rules: ['required'],
  },
  {
    key: 'outputBigQueryTable',
    type: 'text',
    title: 'Output BigQuery Table, for example, "hg19_acmg_genes_interval_rich_annotated"',
    rules: ['required'],
  },
  // {
  //   key: 'bucketAddrAnnotatedVCF',
  //   type: 'text',
  //   title: 'The full bucket path to the output VCF file, e.g., "gs://<BUCKET_ID>/outputVCF.vcf"',
  //   rules: ['required', 'gsLink', 'vcfFile'],
  // },
  // {
  //   key: 'VCFCanonicalizeRefNames',
  //   type: 'text',
  //   title: 'The prefix for the reference field in the VCF tables (e.g, "chr"). AnnotationHive automatically canonicalizes the VCF table by removing the prefix in its calculation.',
  //   rules: ['required'],
  // },
  {
    key: 'VCFTables',
    type: 'text',
    title: 'BigQuery address of the mVCF/VCF table on BigQuery, for example, "gbsc-gcp-project-annohive-dev:swarm.1000genomes"',
    rules: ['required'],
  },
  {
    key: 'build',
    type: 'radio',
    title: 'Build type',
    rules: ['required'],
    options: ['hg19', 'hg38'],
    defaultValue: 'hg19',
  },
  // {
  //   key: 'createVCF',
  //   type: 'checkbox',
  //   title: 'If you wish to obtain a VCF file, check this flag',
  //   rules: ['required'],
  //   defaultValue: false
  // },
  {
    key: 'variant',
    type: 'annotationFieldsPicker',
    title: 'Variant Annotation Tables, for example, "gbsc-gcp-project-cba:AnnotationHive_hg19.hg19_Cosmic70:ID"',
    rules: ['required'],
  }
]


class AnnotationProcessContainer extends Component {
  render() {
    return (
      <>
        <Form title={title}
          fields={fields}
          API_ROUTE={`${API_ROUTES.ANNOTATION_PROCESS}/variant`}
        />
      </>
    )
  }
}

export default AnnotationProcessContainer