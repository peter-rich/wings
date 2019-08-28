import React from 'react';
import PropTypes from 'prop-types'
import colors from '../styles/colors'

const headers = ['#', 'Job id', 'Job Name', 'Status', 'Create Time', 'End time', 'Link to the Log File']

function Table(props) {
  const title = 'Jobs';
  const { records, loading } = props
  return (
    <div>
      <h3>{title}</h3>
      <table>
        <tbody>
          <tr>
            { headers.map((colName, i) => (
              <th key={`head-${i}`}>{colName}</th>
            ))
            }
          </tr>
          {records.map((record, i) => (
            <tr key={i} style={{ color: colors[record.status] }}>
              <td>{i}</td>
              <td>{record.job_id}</td>
              <td>{record.name}</td>
              <td>{record.status}</td>
              <td>{record.created_at}</td>
              <td>{record.finished_at}</td>
              <td>
                <a href={`https://storage.cloud.google.com/${record.gs_link.substring(5)}?authuser=1`}
                  rel='noopener noreferrer'
                  target='_blank'>{record.gs_link}</a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      { loading &&
        <div className="progress">
          <div className="indeterminate"></div>
        </div>
      }
    </div>
  )
}

Table.propTypes = {
  loading: PropTypes.bool.isRequired,
  records: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)).isRequired
}

export default Table;