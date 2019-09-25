import React, { Component } from 'react'
import Form from './Form'
import { API_ROUTES, REGIONS } from '../../constants'

const title = 'CNVnator'
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
      key: 'sample_id',
      title: 'Sample ID, for example, "Sample1_A04"',
      type: 'text',
      rules: ['required'],
    },
    {
      key: 'input_bams_dir',
      title: 'Path to input Ubam files, For example, "gs://CNVnator-dev/bams"',
      type: 'text',
      rules: ['required', 'gsLink'],
    },
    {
      key: 'bucket_path',
      title: 'Bucket path, For example, "gs://CNVnator-dev"',
      type: 'text',
      rules: ['required', 'gsLink'],
    }
  ]
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