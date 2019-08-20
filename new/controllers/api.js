const express = require('express')
const router = express.Router()
const fs = require('fs')
const path = require('path')
const exec = require('child_process').exec
// Routes
const ROUTES = {
  FASTQ_TO_SAM: '/fastqtosam',
  GATK: '/gatk',
  ANNO_HIVE: '/annohive',
  JOB_HISTORY: '/jobhistory',
  AUTH: '/authenticate'
}
// Routing Handling
router.post(ROUTES.FASTQ_TO_SAM, (req, res) => {
  const rawData = fs.readFileSync(path.resolve('../../../Downloads/gbsc-gcp-project-annohive-dev-2817dc37f2ed.json'));
  const cred = JSON.parse(rawData);
  console.log(req.body)
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

  const cmd = `dsub  --project ${project_id} --min-cores 1 --min-ram 7.5 --preemptible --boot-disk-size 20 --disk-size 200  --zones ${time_zone} --logging ${log_file} --input FASTQ_1=${input_file_1} --input FASTQ_2=${input_file_2} --output UBAM=${output_file} --env SM=${sample}  --image broadinstitute/gatk:4.1.0.0 --env RG=${read_group} --env PL=${platform} --command '/gatk/gatk --java-options "-Xmx8G -Djava.io.tmpdir=bla" ` + "FastqToSam -F1 ${FASTQ_1} -F2 ${FASTQ_2} -O ${UBAM} --SAMPLE_NAME ${SM} -RG ${RG} -PL ${PL}'"
  console.log(cmd)
    // exec(cmd, function(err, stdout, stderr) {
    //   console.log(stdout)
    //   console.error(stderr)
    // })
})

router.post(ROUTES.AUTH, (req, res) => {
  console.log(req.body)
  res.json({
    "asdads": 1310398
  })
})

module.exports = router