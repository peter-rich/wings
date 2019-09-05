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
const _ = require('lodash')
const { API_ROUTES, AUTH_FILE_FIELDNAME } = require(`${__base}/config`)
const { GOOGLE_CRED_PATH } = require(`${__base}/config-server`)

router.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000/')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  next()
})

let logged_in_users = {}

// Routing Handling
router.get(API_ROUTES.CNVNATOR, (req, res) => {
  
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

  const script = exec(cmd)
  const timestamp = new Date().getTime()
  script.stdout.on('data', (chunk)=>{
    console.log('stdout: ', chunk)
    fs.appendFileSync(`${__base}/logs/CNVnator-stdout-${timestamp}.txt`, chunk, function(err) {
      if(err) {
        return console.log(err)
      }
      console.log(`✅"${cmd}!" executed successfully. Log file saved. `)
    })
  })
  script.stderr.on('data', (chunk)=>{
    console.error(chunk)
    fs.appendFileSync(`${__base}/logs/CNVnator-stderr-${timestamp}.txt`, chunk, function(err) {
      if(err) {
        return console.error(err)
      }
      console.error(`❌error appeared when executing "${cmd}!"`)
    })
  })
  script.on('close', code => {
    console.log(`${API_ROUTES.FASTQ_TO_SAM} script closed with : ${code}`)
    if (code == 0) {
      res.status(200).json({ success: true })
    }
  })
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
  const script = exec(cmd)
  const timestamp = new Date().getTime()
  script.stdout.on('data', (chunk)=>{
    console.log('stdout: ', chunk)
    fs.appendFileSync(`${__base}/logs/GATK-stdout-${timestamp}.txt`, chunk, function(err) {
      if(err) {
        return console.log(err)
      }
      console.log(`✅"${cmd}!" executed successfully. Log file saved. `)
    })
  })
  script.stderr.on('data', (chunk)=>{
    console.error(chunk)
    fs.appendFileSync(`${__base}/logs/GATK-stderr-${timestamp}.txt`, chunk, function(err) {
      if(err) {
        return console.error(err)
      }
      console.error(`❌error appeared when executing "${cmd}!"`)
    })
  })
  script.on('close', code => {
    console.log(`${API_ROUTES.FASTQ_TO_SAM} script closed with : ${code}`)
    if (code == 0) {
      res.status(200).json({ success: true })
    }
  })
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

  const script = exec(cmd)
  const timestamp = new Date().getTime()
  script.stdout.on('data', (chunk)=>{
    console.log('stdout: ', chunk)
    fs.appendFileSync(`${__base}/logs/fastqtosam-stdout-${timestamp}.txt`, chunk, function(err) {
      if(err) {
        return console.log(err)
      }
      console.log(`✅"${cmd}!" executed successfully. Log file saved. `)
    })
  })
  script.stderr.on('data', (chunk)=>{
    console.error(chunk)
    fs.appendFileSync(`${__base}/logs/fastqtosam-stderr-${timestamp}.txt`, chunk, function(err) {
      if(err) {
        return console.error(err)
      }
      console.error(`❌error appeared when executing "${cmd}!"`)
    })
  })
  script.on('close', code => {
    console.log(`${API_ROUTES.FASTQ_TO_SAM} script closed with : ${code}`)
  })
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
router.get(API_ROUTES.LOG_IN, (req, res) => {
  if (logged_in_users[req.session.client_id]) {
    res.status(200).json({ "success": true })
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
  // TODO:
  const file = req.file
  if (!file) {
    res.status(400).json({ "error": 'Please upload a json file' })
  }
  if(!req.session.client_id) {
    const client_id = file.filename.substring(0, file.filename.length-5)
    req.session.client_id = client_id
    logged_in_users[client_id] = client_id
  }

  res.status(200).json({ "success": true })
})

router.post(API_ROUTES.LOG_OUT, (req, res) => {
  // TODO:
})

module.exports = router

// fetch('http://another.com', {
//   credentials: "include"
// })

// 200 OK
// Access-Control-Allow-Origin: https://javascript.info
// Access-Control-Allow-Credentials: true