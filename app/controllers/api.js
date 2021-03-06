const express = require('express')
const router = express.Router()
const fs = require('fs')
const exec = require('child_process').exec
const Op = require('sequelize').Op
const multer = require('multer')
const uuid = require('uuid')
const Job = require(`${__base}/models/Job`)
const Annotation = require(`${__base}/models/Annotation`)
const query = require(`${__base}/serverHelpers/query`)
const updateJobs = require(`${__base}/tasks/updateJobs`)
const { execPromise } = require(`${__base}/serverHelpers/hoc`)
const _ = require('lodash')
const { API_ROUTES, AUTH_FILE_FIELDNAME, ANNOTATE_TYPES, SERVICE_ACCOUNT_KEYS } = require(`${__base}/config`)
const { GOOGLE_CRED_PATH } = require(`${__base}/config-server`)

let logged_in_users = {}

// Routing Handling
router.post(`${API_ROUTES.ANNOTATION_IMPORT}`, (req, res) => {
  const GOOGLE_CRED_FILE_PATH = `${GOOGLE_CRED_PATH}/${req.session.client_id}.json`
  const authFile = fs.readFileSync(GOOGLE_CRED_FILE_PATH)
  const cred = JSON.parse(authFile)
  const cmdParams = Object.assign({ GOOGLE_CRED_FILE_PATH }, _.pick(req.body, [
    'region',
    'logs_path',
    'staging_address',
    'bigQueryDatasetId',
    'headers',
    'columnOrder',
    'bigQueryVCFTableId',
    'VCFInputTextBucketAddr',
    'build'
  ]), _.pick(cred, ['project_id']))
  console.log(cmdParams)

  const { BigQuery } = require('@google-cloud/bigquery')
  const bigquery = new BigQuery({
    keyFilename: GOOGLE_CRED_FILE_PATH,
    projectId: cred.project_id
  })

  function checkVCFListTable() {
    const tableId = 'VCFList'
    const dataset = bigquery.dataset(req.body.bigQueryDatasetId)
    const table = dataset.table(tableId)
    return new Promise(function(resolve, reject) {
      table.exists()
        .then(exists => {
          if (!exists[0]) {
            console.log(`Table "${tableId}" doesn't exist!!!`)
            cmd = query.createVCFList(cmdParams)
            resolve(cmd)
          } else {
            resolve('')
          }
        })
        .catch(err => {
          console.log(`err occured while querying table ${tableId}: ${err}`)
          reject(err)
        })
    })
  }

  const runScript = async () => {
    try {
      let cmd = ''
      cmd = await checkVCFListTable()
      cmd += query.importVCF(cmdParams)
      console.log(cmd)
      const timestamp = uuid.v1()
      result = await execPromise(cmd, 'annotation_Import', timestamp)
      if (result.success) {
        res.status(200).json(result)
      } else {
        res.status(400).json(result)
      }
    } catch (err) {
      console.error(err.error)
      res.status(500).json(err)
    }
  }
  runScript()
})

router.post(`${API_ROUTES.ANNOTATION_PROCESS}`, (req, res) => {
  const GOOGLE_CRED_FILE_PATH = `${GOOGLE_CRED_PATH}/${req.session.client_id}.json`
  const authFile = fs.readFileSync(GOOGLE_CRED_FILE_PATH)
  const cred = JSON.parse(authFile)

  const cmdParams = Object.assign({ GOOGLE_CRED_FILE_PATH }, _.pick(req.body, [
    'region',
    'logs_path',
    'stagingLocation',
    'bigQueryDatasetId',
    'outputBigQueryTable',
    'googleVCF',
    'variant',
    'generic',
    'build',
    'VCFTables',
  ]), _.pick(cred, ['project_id']))
  console.log(cmdParams)
  const cmd = query.annotateVCF(cmdParams)
  console.log(cmd)
  const timestamp = uuid.v1()
  let result
  const runScript = async () => {
    try {
      result = await execPromise(cmd, 'annotate_variant_process', timestamp)
      res.status(200).json(result)
    } catch (err) {
      res.status(500).json(err)
    }
  }
  runScript()
})

router.get(`${API_ROUTES.ANNOTATION_LIST}/:type`, (req, res) => {
  if (!req.params.type) {
    res.status(422).json({ error: 'type is missing'})
  } else if (!ANNOTATE_TYPES.includes(req.params.type)) {
    res.status(422).json({ error: 'wrong or missing type'})
  } else {
    const { type } = req.params
    const { BigQuery } = require('@google-cloud/bigquery')
    const GOOGLE_CRED_FILE_PATH = `${GOOGLE_CRED_PATH}/${req.session.client_id}.json`
    const authFile = fs.readFileSync(GOOGLE_CRED_FILE_PATH)
    const cred = JSON.parse(authFile)
    const { project_id } = cred

    const bigquery = new BigQuery({
      keyFilename: GOOGLE_CRED_FILE_PATH,
      projectId: project_id
    })
    const datasetId = 'AnnotationHive'
    const tableId = 'AnnotationList'

    async function queryParamsNamed() {
      // The SQL query to run
      const alias = 'List'
      const view = `
        SELECT
          *, CONCAT(${alias}.source_name, '-', ${alias}.source_link,  '-', ${alias}.bigquery_table, '-', ${alias}.type, '-', ${alias}.fields) as search_string
        FROM
          \`${project_id}.${datasetId}.${tableId}\` as ${alias}
        WHERE
          (
            type="${type}"
          AND
            bigquery_table IS NOT NULL
          )
      `
      const sqlQuery = `
        SELECT
          *
        FROM (
          ${view}
        )
        WHERE
          search_string IS NOT NULL
      `

      const options = {
        query: sqlQuery,
        // Location must match that of the dataset(s) referenced in the query.
        location: 'US',
      }
      /// Run the query as a job
      const [job] = await bigquery.createQueryJob(options)
      console.log(`SQL Job ${job.id} started.`)

      // Wait for the query to finish
      const [rows] = await job.getQueryResults()
      res.status(200).json(rows)
    }
    // [END bigquery_query_params_named]
    try {
      queryParamsNamed()
    } catch (err) {
      res.status(500).json(err)
    }
  }
})

router.post(API_ROUTES.CNVNATOR, (req, res) => {
  const GOOGLE_CRED_FILE_PATH = `${GOOGLE_CRED_PATH}/${req.session.client_id}.json`
  const authFile = fs.readFileSync(GOOGLE_CRED_FILE_PATH)
  const cred = JSON.parse(authFile)

  const cmdParams = Object.assign({ GOOGLE_CRED_FILE_PATH, bin_size: 100 }, _.pick(req.body, [
    'region',
    'sample_id',
    'bucket_path',
    'input_bams_dir',
  ]), _.pick(cred, ['project_id']))
  console.log(cmdParams)
  const cmd = query.launchCNVnator(cmdParams)
  console.log(cmd)
  const timestamp = uuid.v1()
  let result
  const runScript = async () => {
    try {
      result = await execPromise(cmd, 'CNVnator', timestamp)
      if (result.success) {
        res.status(200).json(result)
      } else {
        res.status(400).json(result)
      }
    } catch (err) {
      console.error(err.error)
      res.status(500).json(err)
    }
  }
  runScript()
})

router.post(API_ROUTES.GATK, (req, res) => {
  const GOOGLE_CRED_FILE_PATH = `${GOOGLE_CRED_PATH}/${req.session.client_id}.json`
  const authFile = fs.readFileSync(GOOGLE_CRED_FILE_PATH)
  const cred = JSON.parse(authFile)

  const cmdParams = Object.assign({ GOOGLE_CRED_FILE_PATH }, _.pick(req.body, [
    'region',
    'bucket_name',
    'sample_name',
    'input_file_1',
    'input_file_2'
  ]), _.pick(cred, ['project_id']))
  console.log(cmdParams)
  const cmd = query.launchGATK(cmdParams)
  console.log(cmd)
  const timestamp = uuid.v1()
  const runScript = async () => {
    try {
      result = await execPromise(cmd, 'GATK', timestamp)
      if (result.success) {
        res.status(200).json(result)
      } else {
        res.status(400).json(result)
      }
    } catch (err) {
      console.error(err.error)
      res.status(500).json(err)
    }
  }
  runScript()
})

router.post(API_ROUTES.FASTQ_TO_SAM, (req, res) => {
  const GOOGLE_CRED_FILE_PATH = `${GOOGLE_CRED_PATH}/${req.session.client_id}.json`
  const authFile = fs.readFileSync(GOOGLE_CRED_FILE_PATH)
  const cred = JSON.parse(authFile)

  const cmdParams = Object.assign({ GOOGLE_CRED_FILE_PATH }, _.pick(req.body, [
    'region',
    'logging_dest',
    'sample_name',
    'read_group',
    'platform',
    'input_file_1',
    'input_file_2',
    'output_file'
  ]), _.pick(cred, ['project_id']))

  console.log(cmdParams)
  const cmd = query.launchFastqtosam(cmdParams)
  console.log(cmd)
  const timestamp = uuid.v1()
  const runScript = async () => {
    try {
      const result = await execPromise(cmd, 'fastqtosam', timestamp)
      if (result.success) {
        res.status(200).json(result)
      } else {
        res.status(400).json(result)
      }
    } catch (err) {
      console.error(err)
      res.status(500).json(err)
    }
  }
  runScript()
})

router.get(API_ROUTES.JOBS, (req, res) => {
  const { startdate, enddate } = req.query
  console.log(`Fetching jobs in range: [${startdate ? startdate : '~'} and ${enddate ? enddate : '~'}]`)
  let whereCondition = {}
  if (startdate) {
    whereCondition.created_at = { [Op.gte]: new Date(startdate) }
  }
  if (enddate) {
    whereCondition.finished_at = { [Op.lte]: new Date(enddate) }
  }
  Job
    .findAll({ where: whereCondition })
    .then(jobs => {
      res.status(200).json({ jobs })
    })
    .catch((err) => {
      res.status(500).json({
        "error": err
      })
    })
})

router.get(API_ROUTES.UPDATE_JOBS, (req, res) => {
  const runScript = async () => {
    try {
      result = await updateJobs(req.session.client_id)
      res.status(200).json(result)
    } catch (err) {
      res.status(500).json(err)
    }
  }
  runScript()
})

// Get status
router.get(API_ROUTES.REQUEST_USER, (req, res) => {
  if (logged_in_users[req.session.client_id]) {
    const GOOGLE_CRED_FILE_PATH = `${GOOGLE_CRED_PATH}/${req.session.client_id}.json`
    const authFile = fs.readFileSync(GOOGLE_CRED_FILE_PATH)
    const { project_id } = JSON.parse(authFile)
    res.status(200).json({ "success": true, project_id })
  } else {
    res.status(401).json({ "success": false })
  }
})

const authFileStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `${GOOGLE_CRED_PATH}`)
  },
  filename: function (req, file, cb) {
    cb(null, uuid.v1() + '.json')
  }
})
const authFileUpload = multer({ storage: authFileStorage })
// Log in with auth file
router.post(API_ROUTES.LOG_IN, authFileUpload.single(AUTH_FILE_FIELDNAME), (req, res, next) => {
  const file = req.file
  if (!file) {
    res.status(400).json({ "error": 'Please upload a json file' })
  }
  if(!req.session.client_id) {
    const client_id = file.filename.substring(0, file.filename.length-5)
    const newAuthFile = fs.readFileSync(file.path)
    const newCred = JSON.parse(newAuthFile)
    if (file.mimetype !== 'application/json') {
      res.status(200).json({ "success": false, error: 'Incorrect auth file type uploaded.' })
    } else if (JSON.stringify(Object.keys(newCred)) === JSON.stringify(SERVICE_ACCOUNT_KEYS)) {
      req.session.client_id = client_id
      logged_in_users[client_id] = client_id
      res.status(200).json({ "success": true })
    } else {
      res.status(200).json({ "success": false, error: `Incorrect service account file uploaded. It misses one or some keys from the following list: ${SERVICE_ACCOUNT_KEYS}` })
    }
  }
})

router.post(API_ROUTES.LOG_OUT, (req, res) => {
  // TODO: delete session ID
  // TODO: delete auth file
  if(req.session.client_id) {
    const client_id = req.session.client_id
    console.log(`deleting "${__base}/credentials/${client_id}.json"`)
    // fs.unlink(`${__base}/credentials/${client_id}.json`)
    delete logged_in_users[client_id]
    res.status(200).json({ "success": true })
  } else {
    res.status(304).json({ "success": false, error: `Session ID doesn't exist.` })
  }
})

module.exports = router