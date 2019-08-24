import React from 'react';
import PropTypes from 'prop-types'
import colors from '../styles/colors'

const headers = ['#', 'Create Time', 'End time', 'Job id', 'Job Name', 'Link to the Log File', 'Status']

function Table(props) {
  const title = 'Jobs';
  const { records, loading } = props
  console.log(records)
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
            <tr key={i} style={{ color: colors[record[5]] }}>
              <td>{i}</td>
              {record.map((item, j) => {
                if (j === 4) {
                  const url = 'https://storage.cloud.google.com/'.concat(item.substring(5), '?authuser=1')
                  return (
                    <td key={`cell-${i}-${j}`}>
                      <a href={url}
                        rel='noopener noreferrer'
                        target='_blank'>{item}</a>
                    </td>
                  )
                } else {
                  return(
                    <td key={`cell-${i}-${j}`}>{item}</td>
                  )
                }
              })}
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