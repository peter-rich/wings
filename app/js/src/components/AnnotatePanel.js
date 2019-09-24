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

function AnnotatePanel () {
  const title = 'Annotate Panel';
  return (
    <div>
      <h3>{title}</h3>
      <form>
        <label>
          <input placeholder=''></input>
        </label>
      </form>
    </div>
  )
};

export default AnnotatePanel;