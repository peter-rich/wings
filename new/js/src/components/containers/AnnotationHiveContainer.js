import React, { Component } from 'react'
import Form from './Form'
import { API_ROUTES } from '../../constants'

const title = 'Annotation Hive'
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

class AnnotationHive extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isFetching: false
    }
  }

  componentDidMount() {
    fetch
  }

  render() {
    return (
      <Form title={title}
        fields={fields}
        API_ROUTE={API_ROUTES.ANNOTATION_HIVE}
      />
    )
  }
}

export default AnnotationHive