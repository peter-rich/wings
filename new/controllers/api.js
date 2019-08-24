const express = require('express')
const router = express.Router()
const fs = require('fs')
const exec = require('child_process').exec
const { API_ROUTES } = require(`${__base}/config`)
const { execPromise } = require(`${__base}/serverUtils/hoc`)
const GOOGLE_CRED_PATH = process.env.NODE_ENV == 'development' ? `${__base}/local` : `${__base}/credentials`
const GOOGLE_CRED_FILE = 'gbsc-gcp-project-annohive-dev-2817dc37f2ed.json'

router.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000/')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  next()
})

// Routing Handling
router.get('/api/contacts', (req, res) => {
  return db.Contact.findAll()
    .then((contacts) => res.send(contacts))
    .catch((err) => {
      console.log('There was an error querying contacts', JSON.stringify(err))
      return res.send(err)
    });
})

router.post(API_ROUTES.FASTQ_TO_SAM, (req, res) => {
  const authFile = fs.readFileSync(`${GOOGLE_CRED_PATH}/${GOOGLE_CRED_FILE}`)
  const cred = JSON.parse(authFile)
  const { project_id }= cred
  const {
    time_zone,
    log_file,
    sample_name,
    read_group,
    platform,
    input_file_1,
    input_file_2,
    output_file
  } = req.body

  const cmd = `export GOOGLE_APPLICATION_CREDENTIALS=${GOOGLE_CRED_PATH}/${GOOGLE_CRED_FILE} && \
  dsub  --project ${project_id} --min-cores 1 --min-ram 7.5 \
  --preemptible --boot-disk-size 20 --disk-size 200  --zones ${time_zone} \
  --logging ${log_file} --input FASTQ_1=${input_file_1} --input FASTQ_2=${input_file_2} \
  --output UBAM=${output_file} --env SM=${sample_name}  \
  --image broadinstitute/gatk:4.1.0.0 --env RG=${read_group} --env PL=${platform} \
  --command '/gatk/gatk --java-options "-Xmx8G -Djava.io.tmpdir=bla" ` +
  "FastqToSam -F1 ${FASTQ_1} -F2 ${FASTQ_2} -O ${UBAM} --SAMPLE_NAME ${SM} -RG ${RG} -PL ${PL}'"
  console.log(cmd)

  const script = exec(cmd)
  const timestamp = new Date().getTime()
  script.stdout.on('data', (chunk)=>{
    console.log(chunk)
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
})

router.get(API_ROUTES.JOBS, (req, res) => {
  const authFile = fs.readFileSync(`${GOOGLE_CRED_PATH}/${GOOGLE_CRED_FILE}`)
  const cred = JSON.parse(authFile)
  const { project_id }= cred
  const dstatCmd = `export GOOGLE_APPLICATION_CREDENTIALS=${GOOGLE_CRED_PATH}/${GOOGLE_CRED_FILE} && \
  dstat --provider google-v2 --project ${project_id} --status '*' \
  --full | grep  "job-id\\|job-name\\|status:\\|creat\\|end-time\\|logging: g"`
  const runScript = async () => {
    try {
      const result = await execPromise(dstatCmd)
      let newJobs = []
      const numOfCols = 6
      result.replace(/\r\n/g, "\r").replace(/\n/g, "\r").split(/\r/).forEach((item, i) => {
        const order = Math.floor(i / numOfCols)
        const key = item.split(': ')[0].split('').slice(1).join('').trim()
        let value = item.split(`${key}:`)[1].trim()
        const colOrder = i % numOfCols
        if (colOrder === 0) {
          newJobs.push([])
        }
        if (colOrder === 0 || colOrder === 1) {
          value = value.slice(1, value.length-1)
        }
        newJobs[order].push(value)
      })
      res.status(200).json({
        "jobs": newJobs
      })
    } catch (err) {
      console.error(err.message)
      res.status(500).json({
        "error": err
      })
    }
  }
  runScript()
})
router.post(API_ROUTES.AUTH, (req, res) => {
  console.log(req.body)
  res.json({
    "asdads": 1310398
  })
})

module.exports = router