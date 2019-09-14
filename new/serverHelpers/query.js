const fs = require('fs')
const util = require(`${__base}/serverHelpers/util`)
const AnnotationHive_IMAGE = 'annotationhive/annotationhive_public:1.4'

const getAllJobs = (GOOGLE_CRED_PATH, GOOGLE_CRED_FILE, project_id) => (
  `export GOOGLE_APPLICATION_CREDENTIALS=${GOOGLE_CRED_PATH}/${GOOGLE_CRED_FILE} && \
dstat --provider google-v2 --project ${project_id} --status '*' --status 'SUCCESS' 'FAILURE' \
--full | grep  "job-id\\|job-name\\|status:\\|creat\\|end-time\\|logging: g"`
)

const createVCFList = ({
  GOOGLE_CRED_FILE_PATH,
  project_id,
  region,
  logs_path,
  staging_address,
  bigQueryDatasetId
}) => {
  logs_path = util.trimTrailingChar(logs_path, '/') + '/'
  staging_address = util.trimTrailingChar(staging_address, '/')

  const script = `
    cd /AnnotationHive && \
    mvn compile exec:java -Dexec.mainClass=com.google.cloud.genomics.cba.StartAnnotationHiveEngine \
      -Dexec.args="ImportVCFFromGCSToBigQuery \
      --project=${project_id} \
      --stagingLocation=${staging_address}/ \
      --bigQueryDatasetId=${bigQueryDatasetId} \
      --runner=DataflowRunner \
      --createVCFListTable=true" \
    -Pdataflow-runner && \
  `

  const cmd = `
    export GOOGLE_APPLICATION_CREDENTIALS=${GOOGLE_CRED_FILE_PATH} && \
    dsub \
      --provider google-v2 \
      --project ${project_id} \
      --logging ${logs_path} \
      --regions ${region} \
      --command '${script}' \
      --image ${AnnotationHive_IMAGE} \
      --min-ram 40 \
      --min-cores 2 \
  `

  return cmd
}

const importVCF = ({
    GOOGLE_CRED_FILE_PATH,
    project_id,
    region,
    logs_path,
    staging_address,
    bigQueryDatasetId,
    headers,
    column_order,
    bigQueryVCFTableId,
    VCFInputTextBucketAddr,
    build,
    sampleIDs
  }) => {
  logs_path = util.trimTrailingChar(logs_path, '/') + '/'
  staging_address = util.trimTrailingChar(staging_address, '/')

  const script = `
    cd /AnnotationHive && \
    mvn compile exec:java -Dexec.mainClass=com.google.cloud.genomics.cba.StartAnnotationHiveEngine \
      -Dexec.args="ImportVCFFromGCSToBigQuery \
        --project=${project_id} \
        --stagingLocation=${staging_address} \
        --bigQueryDatasetId=${bigQueryDatasetId} \
        --header=${headers} \
        --columnOrder=${column_order} \
        --base0=no \
        --bigQueryVCFTableId=${bigQueryVCFTableId} \
        --VCFInputTextBucketAddr=${VCFInputTextBucketAddr} \
        --VCFVersion=1.0 \
        --build=${build} \
        --columnSeparator=\\t \
        --POS=true \
        --sampleIDs=${sampleIDs}
        --runner=DataflowRunner" \
    -Pdataflow-runner
  `
  const cmd = `
    export GOOGLE_APPLICATION_CREDENTIALS=${GOOGLE_CRED_FILE_PATH} && \
    dsub \
      --provider google-v2 \
      --project ${project_id} \
      --logging ${logs_path} \
      --regions ${region} \
      --command '${script}' \
      --image ${AnnotationHive_IMAGE} \
      --min-ram 40 \
      --min-cores 2 \
  `

  return cmd
}


const variantAnnotateVCF = ({
  GOOGLE_CRED_FILE_PATH,
  project_id,
  region,
  logs_path,
  bigQueryDatasetId,
  outputBigQueryTable,
  annotateType,
  variant,
  build,
  VCFTables,
  stagingLocation,
  createVCF
}) => {
  const script = `
    cd /AnnotationHive && \
    mvn compile exec:java \
    -Dexec.mainClass=com.google.cloud.genomics.cba.StartAnnotationHiveEngine \
    -Dexec.args="BigQueryAnnotateVariants \
      --projectId=${project_id} \
      --bigQueryDatasetId=${bigQueryDatasetId}  \
      --outputBigQueryTable=${outputBigQueryTable} \
      ${annotateType == 'variant' ? '--variantAnnotationTables=' + variant : ''}  \
      --VCFTables=${VCFTables} \
      --build=${build} \
      --createVCF=${createVCF} \
      --stagingLocation=${stagingLocation} \
      --runner=DataflowRunner" \
    -Pdataflow-runner
  `

  const cmd = `
      export GOOGLE_APPLICATION_CREDENTIALS=${GOOGLE_CRED_FILE_PATH} && \
      dsub \
        --provider google-v2 \
        --project ${project_id} \
        --logging ${logs_path} \
        --regions ${region} \
        --command '${script}' \
        --image ${AnnotationHive_IMAGE} \
        --min-ram 40 \
        --min-cores 2 \
    `

    return cmd
}

const launchFastqtosam = ({
  GOOGLE_CRED_FILE_PATH,
  project_id,
  region,
  logging_dest,
  input_file_1,
  input_file_2,
  output_file,
  sample_name,
  read_group,
  platform}) => (
  `export GOOGLE_APPLICATION_CREDENTIALS=${GOOGLE_CRED_FILE_PATH} && \
  dsub  --project ${project_id} --min-cores 1 --min-ram 7.5 \
  --preemptible --boot-disk-size 20 --disk-size 200  --regions ${region} \
  --logging ${logging_dest} --input FASTQ_1=${input_file_1} --input FASTQ_2=${input_file_2} \
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

const launchCNVnator= ({
  region,
  GOOGLE_CRED_FILE_PATH,
  sample_id,
  bin_size,
  project_id,
  input_bams_dir,
  bucket_path
}) => {
  input_bams_dir = util.trimTrailingChar(input_bams_dir, '/')
  bucket_path = util.trimTrailingChar(bucket_path, '/')
  const IMAGE = 'vandhanak/cnvnator:0.3.3'
  const JOB_NAME = `cnvnator-sample-${bin_size}bin`
  // path to a single .bam file
  const INPUT_BAMS= `${input_bams_dir}`
  const REF_CHROMOSOMES_PATH = `${bucket_path}/CNVnator-chromosomes`
  const LOGGING_DIR = `${bucket_path}/CNVnator-logs`
  const OUTPUT_DIR = `${bucket_path}/CNVnator-output/*`
  const SAMPLE_BASE_DIR = `${sample_id}_100bin`
  const INTERMEDIATE_FILES_DIR = `${SAMPLE_BASE_DIR}/${SAMPLE_BASE_DIR}_intermediate_files`
  const script = `
    export OMP_NUM_THREADS=2 && \
    mkdir "${SAMPLE_BASE_DIR}" && \
    mkdir "${INTERMEDIATE_FILES_DIR}" && \
    cnvnator -root "${INTERMEDIATE_FILES_DIR}/my.root" -chrom 16 -tree \${INPUT_BAMS_FOLDER} -unique && \
    cnvnator -root "${INTERMEDIATE_FILES_DIR}/my.root" -chrom 16 -his ${bin_size} -d "\${REF_CHROMOSOMES_FILEPATH}" > "${INTERMEDIATE_FILES_DIR}/my.his" && \
    cnvnator -root "${INTERMEDIATE_FILES_DIR}/my.root" -chrom 16 -stat ${bin_size}  > "${INTERMEDIATE_FILES_DIR}/my.stats" && \
    cnvnator -root "${INTERMEDIATE_FILES_DIR}/my.root" -chrom 16 -eval ${bin_size}  > "${INTERMEDIATE_FILES_DIR}/my.eval" && \
    cnvnator -root "${INTERMEDIATE_FILES_DIR}/my.root" -chrom 16 -partition ${bin_size}  > "${INTERMEDIATE_FILES_DIR}/my.partition" &&\
    cnvnator -root "${INTERMEDIATE_FILES_DIR}/my.root" -chrom 16 -call ${bin_size}  > "${SAMPLE_BASE_DIR}/${SAMPLE_BASE_DIR}_CNVs.out" && \
    wait && \
    perl /opt/build/CNVnator_v0.3.3/cnvnator2VCF.pl "${SAMPLE_BASE_DIR}/${SAMPLE_BASE_DIR}_CNVs.out" > "${SAMPLE_BASE_DIR}/${SAMPLE_BASE_DIR}_CNVs.vcf" && \
    cp -r "${SAMPLE_BASE_DIR}" "\${OUT_DIR}"
  `
  const cmd = `
    export GOOGLE_APPLICATION_CREDENTIALS=${GOOGLE_CRED_FILE_PATH} && \
    dsub \
      --project "${project_id}" \
      --regions "${region}" \
      --logging "${LOGGING_DIR}" \
      --disk-size 500 \
      --name "${JOB_NAME}" \
      --env sample_id="${sample_id}" \
      --input INPUT_BAMS_FOLDER="${INPUT_BAMS}" \
      --input-recursive REF_CHROMOSOMES_FILEPATH="${REF_CHROMOSOMES_PATH}" \
      --output-recursive OUT_DIR="$(dirname "${OUTPUT_DIR}")" \
      --image ${IMAGE} \
      --command '${script}' \
      --min-ram 40 \
      --min-cores 2 \
  `
  return cmd
}
module.exports = {
  getAllJobs,
  createVCFList,
  importVCF,
  variantAnnotateVCF,
  launchFastqtosam,
  launchGATK,
  launchCNVnator
}