import React, { Component } from 'react'
import SourceList from '../SourceList'
import Form from './Form'
import { SOURCE_TYPES, API_ROUTES } from '../../constants'

const title = 'AnnotationHive Process'
const fields = [
  {
    key: 'bigQueryDatasetId',
    title: 'BigQuery Dataset ID, for example, "falcon"',
    required: true
  },
  {
    key: 'outputBigQueryTable',
    title: 'Output BigQuery Table, for example, "hg19_acmg_genes_interval_rich_annotated"',
    required: true
  },
  {
    key: 'bucketAddrAnnotatedVCF',
    title: ' the full bucket and name address to the output VCF file (e.g., gs://mybucket/outputVCF.vcf)',
    required: true
  },
  {
    key: 'VCFCanonicalizeRefNames',
    title: ' the prefix for the reference field in the VCF tables (e.g, "chr"). AnnotationHive automatically canonicalizes the VCF table by removing the prefix in its calculation.',
    required: true
  },
  {
    key: 'variantAnnotationTables',
    title: 'Variant Annotation Tables, for example, "gbsc-gcp-project-cba:AnnotationHive_hg19"',
    required: true
  },
  {
    key: 'VCFTables',
    title: 'VCF Tables, for example, "gbsc-gcp-project-annohive-dev:swarm.1000genomes"',
    required: true
  },
  {
    key: 'stagingLocation',
    title: 'Staging Location, for example, "gs://gbsc-gcp-project-annohive-dev-user-lektin/falcon_dev/"',
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