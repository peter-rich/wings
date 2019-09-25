import React, { Component } from 'react'
import Form from './Form'
import { API_ROUTES, REGIONS } from '../../constants'

const title = 'FastqToSam'
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
      key: 'logging_dest',
      title: 'Logging destination. For example, "gs://genomics-public-data/logs"',
      type: 'text',
      rules: ['required', 'gsLink']
    },
    {
      key: 'sample_name',
      title: 'Sample Name, for example "ERR250256"',
      type: 'text',
      rules: ['required']
    },
    {
      key: 'read_group',
      title: 'Read Group. For example, "RG0"',
      type: 'text',
      rules: ['required']
    },
    {
      key: 'platform',
      title: 'Platform. For example, "illumina"',
      type: 'text',
      rules: ['required']
    },
    {
      key: 'input_file_1',
      title: 'Input File 1. For example, "gs://genomics-public-data/platinum-genomes/fastq/ERR194159_1.fastq.gz"',
      type: 'text',
      rules: ['required', 'gsLink']
    },
    {
      key: 'input_file_2',
      title: 'Input File 2. For example, "gs://genomics-public-data/platinum-genomes/fastq/ERR194159_2.fastq.gz"',
      type: 'text',
      rules: ['required', 'gsLink']
    },
    {
      key: 'output_file',
      title: 'Output File (with ".bam" extension)',
      type: 'text',
      rules: ['required', 'gsLink', 'bamFile']
    }
  ]
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