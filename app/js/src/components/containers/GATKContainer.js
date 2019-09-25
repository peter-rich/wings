import React, { Component } from 'react'
import Form from './Form'
import { API_ROUTES, REGIONS } from '../../constants'

const title = 'GATK'
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
      key: 'sample_name',
      title: 'Sample Name, for example, "ERR250256"',
      type: 'text',
      rules: ['required']
    },
    {
      key: 'bucket_name',
      title: 'Bucket Name for GCP storage. For example, "gatk-sample"',
      type: 'text',
      rules: ['required']
    },
    {
      key: 'input_file_1',
      title: 'Input ".bam" File 1. For example, "gs://genomics-public-data/platinum-genomes/fastq/ERR194159_1.fastq.bam"',
      type: 'text',
      rules: ['required', 'gsLink', 'bamFile']
    },
    {
      key: 'input_file_2',
      title: 'Input ".bam" File 2. For example, "gs://genomics-public-data/platinum-genomes/fastq/ERR194159_2.fastq.bam"',
      type: 'text',
      rules: []
    }
  ]
]

class GATKContainer extends Component {
  render() {
    return (
      <Form title={title}
        fields={fields}
        API_ROUTE={API_ROUTES.GATK}
      />
    )
  }
}

export default GATKContainer