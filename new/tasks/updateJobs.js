const fs = require('fs')
const { GOOGLE_CRED_PATH, GOOGLE_CRED_FILE } = require(`${__base}/config-server`)
const Job = require(`${__base}/models/Job`)
const query = require(`${__base}/serverHelpers/query`)
const { execPromise } = require(`${__base}/serverHelpers/hoc`)

const runScript = async (client_id) => {
  try {
    const GOOGLE_CRED_FILE = `${client_id}.json`
    const authFile = fs.readFileSync(`${GOOGLE_CRED_PATH}/${GOOGLE_CRED_FILE}`)
    const cred = JSON.parse(authFile)
    const { project_id }= cred
    const dstatCmd = query.getAllJobs(GOOGLE_CRED_PATH, GOOGLE_CRED_FILE, project_id)
    const result = await execPromise(dstatCmd)
    let newJobs = []
    const numOfCols = 6
    result.replace(/\r\n/g, "\r").replace(/\n/g, "\r").split(/\r/).forEach((item, i) => {
      const order = Math.floor(i / numOfCols)
      const key = item.split(': ')[0].split('').slice(1).join('').trim()
      let value = item.split(`${key}:`)[1].trim()
      const colOrder = i % numOfCols
      if (colOrder === 0) {
        newJobs.push({})
      }
      if (colOrder === 0 || colOrder === 1) {
        value = value.slice(1, value.length-1)
      }
      switch (colOrder) {
        case 0:
          newJobs[order].created_at = value
        case 1:
          newJobs[order].finished_at = value
        case 2:
          newJobs[order].job_id = value
        case 3:
          newJobs[order].name = value
        case 4:
          newJobs[order].gs_link = value
        case 5:
          newJobs[order].status = value
      }
    })
    newJobs.forEach(job => {
      console.log(job)
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
  } catch (err) {
    console.error(err.message)
  }
}

module.exports = runScript