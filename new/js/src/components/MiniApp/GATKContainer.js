import React, { Component } from 'react'
import Form from './Form'

const title = 'GATK'
const fields = [
  {
    key: 'time_zone',
    title: 'Select a time Zone',
    required: true
  },
  {
    key: 'sample_name',
    title: 'Sample Name',
    required: true
  },
  {
    key: 'bucket_name',
    title: 'Bucket Name',
    required: true
  },
  {
    key: 'input_file_1',
    title: 'Input File 1. For example, "gs://genomics-public-data/platinum-genomes/fastq/ERR194159_1.fastq.gz"',
    required: true
  },
  {
    key: 'input_file_2',
    title: 'Input File 2. For example, "gs://genomics-public-data/platinum-genomes/fastq/ERR194159_2.fastq.gz"',
    required: true
  }
]

class FastqToSamContainer extends Component {
  render() {
    return (
      <Form title={title} fields={fields}/>
    )
  }
}

export default FastqToSamContainer