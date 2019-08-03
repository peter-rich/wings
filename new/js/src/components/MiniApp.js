import React from 'react';

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

function MiniApp () {
  const title = 'Annotate';
  const description = 'AnnotationHive: A Cloud-based Annotation Engine';
  return (
    <div class="card">
      <div class="card-content">
        <span class="card-title">{title}</span>
        <p>{description}</p>
      </div>
      <div class="card-action">
        <a href="#">Start</a>
      </div>
    </div>
  )
};

export default MiniApp;