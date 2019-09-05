import React, { Component } from 'react'
import Form from './Form'
import { API_ROUTES } from '../../constants'

const title = 'FastqToSam'
const fields = [
  {
    key: 'region',
    title: 'Region',
    required: true
  },
  {
    key: 'logging_dest',
    title: 'Logging destination. For example, "gs://genomics-public-data/logs"',
    required: true
  },
  {
    key: 'sample_name',
    title: 'Sample Name',
    required: true
  },
  {
    key: 'read_group',
    title: 'Read Group. For example, "RG0"',
    required: true
  },
  {
    key: 'platform',
    title: 'Platform. For example, "illumina"',
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
  },
  {
    key: 'output_file',
    title: 'Output File (with ".bam" extension)',
    required: true
  },
]

class FastqToSamContainer extends Component {
  render() {
    return (
      <Form title={title}
        API_ROUTE={API_ROUTES.FASTQ_TO_SAM}
        fields={fields} />
    )
  }
}

export default FastqToSamContainer