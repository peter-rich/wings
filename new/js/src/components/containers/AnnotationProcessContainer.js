import React, { Component } from 'react'
import SourceList from '../SourceList'
import Form from './Form'
import { SOURCE_TYPES, API_ROUTES } from '../../constants'

const title = 'AnnotationHive Process'
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
    key: 'stagingLocation',
    title: 'Staging Location, for example, "gs://<BUCKET_ID>/AnnotationHive/staging/"',
    required: true
  },
  {
    key: 'bigQueryDatasetId',
    title: 'BigQuery DatasetID that will contain the output annotated VCF table, for example, "sample_dataset_id"',
    required: true
  },
  {
    key: 'outputBigQueryTable',
    title: 'Output BigQuery Table, for example, "hg19_acmg_genes_interval_rich_annotated"',
    required: true
  },
  {
    key: 'bucketAddrAnnotatedVCF',
    title: 'The full bucket path to the output VCF file, e.g., "gs://<BUCKET_ID>/outputVCF.vcf"',
    required: true
  },
  {
    key: 'VCFCanonicalizeRefNames',
    title: 'The prefix for the reference field in the VCF tables (e.g, "chr"). AnnotationHive automatically canonicalizes the VCF table by removing the prefix in its calculation.',
    required: true
  },
  {
    key: 'variantAnnotationTables',
    title: 'Variant Annotation Tables, for example, "gbsc-gcp-project-cba:AnnotationHive_hg19"',
    required: true
  },
  {
    key: 'VCFTables',
    title: 'BigQuery address of the mVCF/VCF table on BigQuery, for example, "gbsc-gcp-project-annohive-dev:swarm.1000genomes"',
    required: true
  },
  {
    key: 'createVCF',
    type: 'checkbox',
    title: 'If you wish to obtain a VCF file, check this flag',
    required: true
  }
]


class AnnotationProcessContainer extends Component {
  render() {
    return (
      <>
        <Form title={title}
          fields={fields}
          API_ROUTE={API_ROUTES.ANNOTATION_PROCESS}
        />
        <SourceList type={SOURCE_TYPES[0]}/>
        <SourceList type={SOURCE_TYPES[1]}/>
      </>
    )
  }
}

export default AnnotationProcessContainer