import React, { Component } from 'react'
// import Form from './Form'
import Popup from '../Popup'
import SourceList from '../SourceList'
import { SOURCE_TYPES } from '../../constants'

// const title = 'Annotation Hive'
// const fields = [
//   {
//     key: 'region',
//     title: 'Region',
//     required: true
//   },
//   {
//     key: 'sample_id',
//     title: 'Sample ID, for example, "Sample1_A04"',
//     required: true
//   },
//   {
//     key: 'input_bams_dir',
//     title: 'Path to input Ubam files',
//     required: true
//   },
//   {
//     key: 'bucket_path',
//     title: 'Bucket path',
//     required: true
//   }
// ]

const TYPE_1 = Symbol()
const TYPE_2 = Symbol()

class AnnotationHive extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isFetching: false,
      [TYPE_1]: false,
      [TYPE_2]: false,
      isPopupActive: false
    }
  }

  render() {
    // const type_1 = this.state[TYPE_1]
    // const type_2 = this.state[TYPE_2]
    return (
      <div className='col s12 m8 push-m2 l6 push-l3'>
        <SourceList type={SOURCE_TYPES[0]}/>
        <SourceList type={SOURCE_TYPES[1]}/>
      </div>
      // <Form title={title}
      //   fields={fields}
      //   API_ROUTE={API_ROUTES.ANNOTATION_LIST}
      // />
    )
  }
}

export default AnnotationHive