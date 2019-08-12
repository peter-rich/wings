import React, { Component } from 'react';
import PropTypes from 'prop-types'

const fields = {
  projectId: 'Project ID',
  runner: 'Runner',
  bigQueryDatasetId: 'Big Query Dataset ID',
  outputBigQueryTable: 'Output Bigquery Table',
  genericAnnotationTables: 'Generic Annotation Tables',
  VCFTables: 'VCT Tables',
  build: 'Build',
  stagingLocation: 'Staging Location'
}

class MiniApp extends Component {
  render() {
    const { title, description } = this.props
    return (
      <div className="card">
        <div className="card-content">
          <span className="card-title">{title}</span>
          <p>{description}</p>
        </div>
        <div className="card-action">
          <a href="#">Start</a>
        </div>
      </div>
    )
  }
};

MiniApp.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired
}

export default MiniApp;