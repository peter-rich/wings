import React from 'react'
import PropTypes from 'prop-types'
import colors from '../styles/colors'
import MC from "materialize-css"

const headers = ['#', 'Job ID', 'Job Name', 'Status', 'Detail', 'Create Time', 'End time', 'Link to the Log File']

const styles = {
  table_cell: {
    maxHeight: '100px',
    padding: '5px',
    overflow: 'scroll',
    cursor: 'copy'
  }
}
function JobViewer(props) {
  const title = 'Jobs'
  const { records, loading } = props

  const _clickToCopy = (e) => {
    const node = e.target
    if (document.body.createTextRange) {
      const range = document.body.createTextRange()
      range.moveToElementText(node)
      range.select()
    } else if (window.getSelection) {
      const selection = window.getSelection()
      const range = document.createRange()
      range.selectNodeContents(node)
      selection.removeAllRanges()
      selection.addRange(range)
    } else {
      console.warn("Could not select text in node: Unsupported browser.")
    }
    document.execCommand('copy')
    MC.toast({html: 'Copied!', inDuration: 200, outDuration: 200, displayLength: 2000 })
  }

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
          {records.map((record, i) => {
            let color
            const status = record.status.toLowerCase()
            if (status.startsWith('failure')) {
              color = colors.FAILURE
              record.status = 'FAILURE'
              record.detail = status.split('failure')[1]
            } else if (status.startsWith('success')) {
              color = colors.SUCCESS
              record.status = 'SUCCESS'
              record.detail = status.split('success')[1]
            } else {
              color = colors.CANCELED
              record.detail = ''
            }
            const linkToLog = `https://storage.cloud.google.com/${record.gs_link.substring(5)}`
            return (
              <tr key={i} style={{ color }}>
                <td><div style={styles.table_cell}>{i}</div></td>
                <td><div onClick={_clickToCopy} style={styles.table_cell}>{record.job_id}</div></td>
                <td><div onClick={_clickToCopy} style={styles.table_cell}>{record.name}</div></td>
                <td><div onClick={_clickToCopy} style={styles.table_cell}>{record.status}</div></td>
                <td><div onClick={_clickToCopy} style={styles.table_cell}>{record.detail}</div></td>
                <td><div onClick={_clickToCopy} style={styles.table_cell}>{record.created_at}</div></td>
                <td><div onClick={_clickToCopy} style={styles.table_cell}>{record.finished_at}</div></td>
                <td>
                  <a href={linkToLog} rel='noopener noreferrer'
                    target='_blank'>{record.gs_link}</a>
                </td>
              </tr>
            )}
          )}
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

JobViewer.propTypes = {
  loading: PropTypes.bool.isRequired,
  records: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.string)).isRequired
}

export default JobViewer