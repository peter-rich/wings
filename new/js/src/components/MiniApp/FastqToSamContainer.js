import React, { Component } from 'react'
import Form from './Form'

const API_ROUTE = 'fastqtosam'
const title = 'Fastq To Sam'
const fields = [
  {
    key: 'time_zone',
    title: 'Select a time Zone',
    required: true
  },
  {
    key: 'log_file',
    title: 'Log File. For example, "gs://genomics-public-data/logs"',
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
    title: 'Output File',
    required: true
  },
]

class FastqToSamContainer extends Component {
  render() {
    return (
      <Form title={title}
        API_ROUTE={API_ROUTE}
        fields={fields} />
    )
  }
}

export default FastqToSamContainer