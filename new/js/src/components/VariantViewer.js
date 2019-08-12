import React from 'react';

const numOfRows = 5;

function VariantViewer () {
  const title = 'Variant Viewer';
  return (
    <div>
      <h3>{title}</h3>
      <table>
        <tbody>
          <tr>
            <th>Variant ID</th>
            <th>CH:bp</th>
            <th>Alleles</th>
            <th>Evidence</th>
            <th>SIFT</th>
            <th>CADD</th>
            <th>DANN</th>
            <th>FATHMM</th>
          </tr>
          {Array(numOfRows).fill().map((_, i) => (
            <tr key={i}>
              <td>{i}</td>
              <td>{i}</td>
              <td>{i}</td>
              <td>{i}</td>
              <td>{i}</td>
              <td>{i}</td>
              <td>{i}</td>
              <td>{i}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
};

export default VariantViewer;