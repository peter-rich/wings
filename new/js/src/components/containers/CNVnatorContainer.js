import React, { Component } from 'react'
import Form from './Form'
import { API_ROUTES } from '../../constants'

const title = 'CNVnator'
const fields = [
  {
    key: 'region',
    title: 'Region',
    required: true
  },
  {
    key: 'sample_id',
    title: 'Sample ID, for example, "Sample1_A04"',
    required: true
  },
  {
    key: 'input_bams_dir',
    title: 'Path to input Ubam files',
    required: true
  },
  {
    key: 'bucket_path',
    title: 'Bucket path',
    required: true
  }
]

class CNVnator extends Component {
  render() {
    return (
      <Form title={title}
        fields={fields}
        API_ROUTE={API_ROUTES.CNVNATOR}
      />
    )
  }
}

export default CNVnator