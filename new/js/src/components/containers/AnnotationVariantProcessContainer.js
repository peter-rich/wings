import React, { Component } from 'react'
import { connect } from 'react-redux'
import Form from './Form'
import { API_ROUTES, ANNOTATE_TYPES } from '../../constants'
import { requestUser } from '../../datastore/auth/authAction'
const title = 'Annotation Process'
// Array of groups of fields
const fields = [
  [
    {
      key: 'region',
      defaultValue: 'us-central1',
      type: 'dropdown',
      title: 'Region',
      rules: ['required'],
    },
    {
      key: 'logs_path',
      type: 'text',
      title: 'Path to log files, for example, "gs://your_bucket/project_id/logs"',
      rules: ['required', 'gsLink'],
    },
    {
      key: 'stagingLocation',
      type: 'text',
      title: 'Staging Location, for example, "gs://<BUCKET_ID>/AnnotationHive/staging/"',
      rules: ['required', 'gsLink'],
    },
    {
      key: 'bigQueryDatasetId',
      type: 'text',
      title: 'BigQuery DatasetID that will contain the output annotated VCF table, for example, "sample_dataset_id"',
      rules: ['required'],
    },
    {
      key: 'outputBigQueryTable',
      type: 'text',
      title: 'Output BigQuery Table, for example, "hg19_acmg_genes_interval_rich_annotated"',
      rules: ['required'],
    },
    {
      key: 'VCFTables',
      type: 'text',
      title: 'BigQuery address of the mVCF/VCF table on BigQuery, for example, "gbsc-gcp-project-annohive-dev:swarm.1000genomes"',
      rules: ['required'],
    },
    {
      key: 'googleVCF',
      type: 'checkbox',
      title: 'If the VCF table was imported using Google APIs, check this flag',
      rules: ['required'],
      defaultValue: false
    },
    {
      key: 'build',
      type: 'radio',
      title: 'Build type:',
      rules: ['required'],
      options: ['hg19', 'hg38'],
      defaultValue: 'hg19',
    }
  ],
  [
    {
      key: ANNOTATE_TYPES[0],
      type: 'annotationFieldsPicker',
      title: 'Variant-based Annotation, pick fields from the annotation tables below.',
      rules: ['fieldRequired'],
    }
  ],
  [
    {
      key: ANNOTATE_TYPES[1],
      type: 'annotationFieldsPicker',
      title: 'Interval-based Annotation, pick fields from the annotation tables below.',
      rules: ['fieldRequired'],
    }
  ]
]

class AnnotationProcessContainer extends Component {
  componentDidMount() {
    if (!this.props.user) {
      this.props.dispatch(requestUser())
    }
  }

  render() {
    const { user } = this.props
    return (
      <>
        {user ?
          <Form title={title}
            fields={fields}
            API_ROUTE={`${API_ROUTES.ANNOTATION_PROCESS}`}
          /> :
          <h1>Fetching project</h1>
        }
      </>
    )
  }
}

const mapStateToProps = state => ({
  user: state.auth.user
})
export default connect(mapStateToProps)(AnnotationProcessContainer)