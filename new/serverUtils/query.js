const fs = require('fs')

const getAllJobs = (GOOGLE_CRED_PATH, GOOGLE_CRED_FILE, project_id) => (
  `export GOOGLE_APPLICATION_CREDENTIALS=${GOOGLE_CRED_PATH}/${GOOGLE_CRED_FILE} && \
dstat --provider google-v2 --project ${project_id} --status '*' \
--full | grep  "job-id\\|job-name\\|status:\\|creat\\|end-time\\|logging: g"`
)

const launchFastqtosam = ({
  GOOGLE_CRED_FILE_PATH,
  project_id,
  region,
  log_file,
  input_file_1,
  input_file_2,
  output_file,
  sample_name,
  read_group,
  platform}) => (
  `export GOOGLE_APPLICATION_CREDENTIALS=${GOOGLE_CRED_FILE_PATH} && \
  dsub  --project ${project_id} --min-cores 1 --min-ram 7.5 \
  --preemptible --boot-disk-size 20 --disk-size 200  --regions ${region} \
  --logging ${log_file} --input FASTQ_1=${input_file_1} --input FASTQ_2=${input_file_2} \
  --output UBAM=${output_file} --env SM=${sample_name}  \
  --image broadinstitute/gatk:4.1.0.0 --env RG=${read_group} --env PL=${platform} \
  --command '/gatk/gatk --java-options "-Xmx8G -Djava.io.tmpdir=bla" ` +
  "FastqToSam -F1 ${FASTQ_1} -F2 ${FASTQ_2} -O ${UBAM} --SAMPLE_NAME ${SM} -RG ${RG} -PL ${PL}'"
)

const launchGATK = ({
  region,
  GOOGLE_CRED_FILE_PATH,
  project_id,
  sample_name,
  bucket_name,
  input_file_1,
  input_file_2
}) => {
  const timestamp = Date.now()
  const FILES_DIR = `${__base}/setting-files/gatk-mvp`
  const TEMP_DIR = `${__base}/temp/${timestamp}`
  fs.mkdirSync(TEMP_DIR)
  const mvp_gatk_image = 'jinasong/wdl_runner:latest'
  const hg38_inputs_raw = fs.readFileSync(`${FILES_DIR}/mvp.hg38.inputs.json`)
  const hg38_inputs = JSON.parse(hg38_inputs_raw)
  let input_files = []
  if (input_file_1) {
    input_files.push(input_file_1)
  }
  if (input_file_2) {
    input_files.push(input_file_2)
  }
  hg38_inputs['germline_single_sample_workflow.sample_name'] = sample_name
  hg38_inputs['germline_single_sample_workflow.base_file_name'] = sample_name
  hg38_inputs['germline_single_sample_workflow.final_vcf_base_name'] = sample_name
  hg38_inputs['germline_single_sample_workflow.flowcell_unmapped_bams'] = input_files
  const new_hg38_file_path = `${TEMP_DIR}/${sample_name}.hg38.inputs.json`
  fs.writeFileSync(new_hg38_file_path, JSON.stringify(hg38_inputs), 'utf8')

  return `
    gsutil cp -r ${FILES_DIR}/gatk-mvp-pipeline/ gs://${bucket_name} && \
    gsutil cp ${new_hg38_file_path} gs://${bucket_name}/${sample_name}/ && \
    export GOOGLE_APPLICATION_CREDENTIALS=${GOOGLE_CRED_FILE_PATH} && \
    dsub \
      --provider google-v2 \
      --project ${project_id} \
      --regions ${region} \
      --min-cores 1 \
      --min-ram 6.5 \
      --image '${mvp_gatk_image}' \
      --logging gs://${bucket_name}/${sample_name}/logging \
      --input CFG=gs://${bucket_name}/gatk-mvp-pipeline/google-adc.conf \
      --input OPTION=gs://${bucket_name}/gatk-mvp-pipeline/generic.google-papi.options.json \
      --input WDL=gs://${bucket_name}/gatk-mvp-pipeline/fc_germline_single_sample_workflow.wdl \
      --input SUBWDL="gs://${bucket_name}/gatk-mvp-pipeline/tasks_pipelines/*.wdl" \
      --input INPUT=gs://${bucket_name}/${sample_name}/${sample_name}.hg38.inputs.json \
      --env MYproject=${project_id} \
      --env ROOT=gs://${bucket_name}/${sample_name}/output \
      --command 'java -Dconfig.file=\${CFG} -Dbackend.providers.JES.config.project=\${MYproject} -Dbackend.providers.JES.config.root=\${ROOT} -jar /cromwell/cromwell.jar run \${WDL} --inputs \${INPUT} --options \${OPTION}' &&\
    rm -rf ${TEMP_DIR}
  `
}

module.exports = {
  getAllJobs,
  launchFastqtosam,
  launchGATK
}