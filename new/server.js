// Modules
const colorizedMorgan = require('./serverUtils/colorizedMorgan')
const path = require('path')
const express = require('express')
const app = express()
const config = require('./config.json')
const exec = require('child_process').exec
const errorhandler = require('errorhandler')
const bodyParser = require('body-parser')
const fs = require('fs')
const initDB = require('./database/initDB')

// Init Database
initDB()
// Routes
const ROUTES = {
  FASTQ_TO_SAM: '/fastqtosam',
  GATK: '/gatk',
  ANNO_HIVE: '/annohive'
}
// Parse request body
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
// Enable logging
app.use(colorizedMorgan)
app.use(express.static('js/build'))
// Enable error handler for development environment
if (process.env.NODE_ENV !== 'prod') {
  app.use(errorhandler());
}
// Routes
app.post('/api/fastqtosam', (req, res) => {
  const rawData = fs.readFileSync(path.resolve('../../../Downloads/gbsc-gcp-project-annohive-dev-2817dc37f2ed.json'));
  const cred = JSON.parse(rawData);
  // console.log(req.body)
  console.log(cred)
  const { project_id }= cred
  const {
    time_zone,
    log_file,
    read_group,
    platform,
    input_file_1,
    input_file_2,
    output_file
  } = req.body
  console.log('The value of GOOGLE_APPLICATION_CREDENTIALS is:', process.env.GOOGLE_APPLICATION_CREDENTIALS);

  const cmd = 'dsub  --project ' + project_id + ' --min-cores 1 --min-ram 7.5 --preemptible \
    --boot-disk-size 20 --disk-size 200  --zones ' + time_zone + ' \
    --logging '+ log_file + ' --input FASTQ_1=' + input_file_1 +  ' --input FASTQ_2=' + input_file_2 + ' \
    --output UBAM=' + output_file + ' --env SM=${sample}  --image broadinstitute/gatk:4.1.0.0  \
    --env RG=' + read_group  + '\
    --env PL=' + platform    + '\
    --command \'/gatk/gatk --java-options "-Xmx8G -Djava.io.tmpdir=bla" \
    FastqToSam -F1 ${FASTQ_1} -F2 ${FASTQ_2} -O ${UBAM} --SAMPLE_NAME ${SM} -RG ${RG} -PL ${PL} \''
    exec(cmd, function(err, stdout, stderr) {
      console.log(stdout)
      console.error(stderr)
    })
})
// Default route
app.use('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/js/build/index.html'))
})
// Init server
app.listen(config.PORT, () => console.log(`AQT Node server listening on port ${config.PORT}!\n\n`))