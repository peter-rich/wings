const fs = require('fs')
const { GOOGLE_CRED_PATH } = require(`${__base}/config-server`)
const Job = require(`${__base}/models/Job`)
const query = require(`${__base}/serverHelpers/query`)
const { execPromise } = require(`${__base}/serverHelpers/hoc`)

function updateJobs(client_id) {
  return new Promise(function(resolve, reject) {
    const runScript = async () => {
      try {
        const GOOGLE_CRED_FILE = `${client_id}.json`
        const authFile = fs.readFileSync(`${GOOGLE_CRED_PATH}/${GOOGLE_CRED_FILE}`)
        const cred = JSON.parse(authFile)
        const { project_id }= cred
        const dstatCmd = query.getAllJobs(GOOGLE_CRED_PATH, GOOGLE_CRED_FILE, project_id)
        const execResult = await execPromise(dstatCmd)
        const result = execResult.success ? execResult.result : []
        let newJobs = []
        const numOfCols = 6
        const headers = ['- create-time:', 'end-time:', 'job-id:', 'job-name:', 'logging:', 'status:']
        i = -1
        let value
        result.replace(/\r\n/g, "\r").replace(/\n/g, "\r").split(/\r/).forEach(item=> {
          const startsWithHeader = headers.some(header => item.trim().startsWith(header))
          if (startsWithHeader) {
            i++
            const key = item.split(': ')[0].split('').slice(1).join('').trim()
            value = item.split(`${key}:`)[1].trim()
          } else{
            value += item
          }
          const row = Math.floor(i / numOfCols)
          const column = i % numOfCols
          console.log(item, 'row:', row, 'column:', column)
          if (column === 0) {
            newJobs.push({})
          }
          if (column === 0 || column === 1) {
            value = value.slice(1, value.length-1)
          }
          switch (column) {
            case 0:
              newJobs[row].created_at = value
            case 1:
              newJobs[row].finished_at = value
            case 2:
              newJobs[row].job_id = value
            case 3:
              newJobs[row].name = value
            case 4:
              newJobs[row].gs_link = value
            case 5:
              newJobs[row].status = value
          }
        })
        newJobs.forEach(job => {
          Job.findOne({ where: { job_id: job.job_id } })
            .then(function(obj) {
              if (obj) {
                obj.update(job)
              } else {
                Job.create(job)
              }
            })
            .then(result => {
              console.log(result)
              return null
            })
            .catch(err => {
              console.error(err)
            })
        })
        resolve({ success: true, result: `${newJobs.length} jobs updated.`})
      } catch (err) {
        console.error(err.error)
        reject({ success: false, error: err })
      }
    }
    runScript()
  })
}

module.exports = updateJobs