import React, { Component } from 'react'
import Form from './Form'

const title = 'GATK'
const fields = [
  {
    key: 'time_zone',
    required: true
  },
  {
    key: 'sample_name',
    required: true
  },
  {
    key: 'bucket_name',
    required: true
  },
  {
    key: 'input_file_1',
    required: true
  },
  {
    key: 'input_file_2',
    required: true
  }
]

class FastqToSamContainer extends Component {
  render() {
    return (
      <Form title={title} fields={fields} />
    )
  }
}

export default FastqToSamContainer