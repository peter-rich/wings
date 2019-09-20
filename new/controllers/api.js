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

router.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000/')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  next()
})

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
  const bigquery = new BigQuery()
  const tableId = 'VCFList'
  const dataset = bigquery.dataset(req.body.bigQueryDatasetId)
  const table = dataset.table(tableId)
  let cmd

  table.exists()
    .then(exists => {
      if (exists[0]) {
        console.log(`Table "${tableId}" exists!!!`)
        cmd = query.importVCF(cmdParams)
        console.log(cmd)
        const script = exec(cmd)
        const timestamp = uuid.v1()
        let result
        const runScript = async () => {
          try {
            result = await execPromise(cmd, 'annotation_Import', timestamp)
            res.status(200).json({ success: true, result })
          } catch (err) {
            console.error(err.message)
            res.status(500).json({ success: false, error: err })
          }
        }
        runScript()
      } else {
        console.log(`Table "${tableId}" doesn't exist!!!`)
        cmd = query.createVCFList(cmdParams)
        console.log(cmd)
        const timestamp = uuid.v1()
        let result
        const runScript = async () => {
          try {
            result = await execPromise(cmd, 'annotation_create_VCFList', timestamp)
            res.status(200).json({ success: true, result })
          } catch (err) {
            console.error(err.message)
            res.status(500).json({ success: false, error: err })
          }
        }
        runScript()
      }
    })
    .catch(err => {
      console.log(`err occured while querying table ${tableId}: ${err}`)
    })
})

router.post(`${API_ROUTES.ANNOTATION_PROCESS}`, (req, res) => {
  console.log(req.body)
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
      res.status(200).json({ success: true, result })
    } catch (err) {
      console.error(err.message)
      res.status(500).json({ success: false, error: err })
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
    const {BigQuery} = require('@google-cloud/bigquery')
    const bigquery = new BigQuery()
    const GOOGLE_CRED_FILE_PATH = `${GOOGLE_CRED_PATH}/${req.session.client_id}.json`
    const authFile = fs.readFileSync(GOOGLE_CRED_FILE_PATH)
    const cred = JSON.parse(authFile)

    const { project_id } = cred
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

      // Run the query
      const [rows] = await bigquery.query(options)
      res.status(200).json(rows)
    }
    // [END bigquery_query_params_named]
    queryParamsNamed()
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
      res.status(200).json({ success: true, result })
    } catch (err) {
      console.error(err.message)
      res.status(500).json({ success: false, error: err })
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
  let result
  const runScript = async () => {
    try {
      result = await execPromise(cmd, 'GATK', timestamp)
      res.status(200).json({ success: true, result })
    } catch (err) {
      console.error(err.message)
      res.status(500).json({ success: false, error: err })
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

  console.log(`cmdParams, `, cmdParams)
  const cmd = query.launchFastqtosam(cmdParams)
  console.log(`cmd, `, cmd)
  const timestamp = uuid.v1()
  let result
  const runScript = async () => {
    try {
      result = await execPromise(cmd, 'fastqtosam', timestamp)
      res.status(200).json({ success: true, result })
    } catch (err) {
      console.error(err.message)
      res.status(500).json({ success: false, error: err })
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
  updateJobs(req.session.client_id)
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