import React, { Component } from 'react'
import Form from './Form'
import { API_ROUTES } from '../../constants'

const title = 'GATK'
const fields = [
  {
    key: 'region',
    title: 'Select a region',
    required: true
  },
  {
    key: 'sample_name',
    title: 'Sample Name, for example, ""',
    required: true
  },
  {
    key: 'bucket_name',
    title: 'Bucket Name for GCP storage. For example, "gatk-sample"',
    required: true
  },
  {
    key: 'input_file_1',
    title: 'Input ".bam" File 1. For example, "gs://genomics-public-data/platinum-genomes/fastq/ERR194159_1.fastq.bam"',
    required: true
  },
  {
    key: 'input_file_2',
    title: 'Input ".bam" File 2. For example, "gs://genomics-public-data/platinum-genomes/fastq/ERR194159_2.fastq.bam"',
    required: true
  }
]

class FastqToSamContainer extends Component {
  render() {
    return (
      <Form title={title}
        fields={fields}
        API_ROUTE={API_ROUTES.GATK}
      />
    )
  }
}

export default FastqToSamContainer