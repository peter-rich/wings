const fs = require('fs')
const util = require(`${__base}/serverHelpers/util`)
const getAllJobs = (GOOGLE_CRED_PATH, GOOGLE_CRED_FILE, project_id) => (
  `export GOOGLE_APPLICATION_CREDENTIALS=${GOOGLE_CRED_PATH}/${GOOGLE_CRED_FILE} && \
dstat --provider google-v2 --project ${project_id} --status '*' \
--full | grep  "job-id\\|job-name\\|status:\\|creat\\|end-time\\|logging: g"`
)

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
  const INPUT_BAMS_FOLDER = `${input_bams_dir}/*.bam`
  const REF_CHROMOSOMES_FILEPATH = `${bucket_path}/CNVnator-chromosomes`
  const LOGGING_DIR = `${bucket_path}/CNVnator-logs`
  const OUT_DIR = `${bucket_path}/CNVnator-output/`
  const script = `
    export OMP_NUM_THREADS=2 && \
    mkdir "${sample_id}_${bin_size}bin" && \
    mkdir "${sample_id}_${bin_size}bin/${sample_id}_${bin_size}bin_intermediate_files" && \
    cnvnator -root "${sample_id}_${bin_size}bin/${sample_id}_${bin_size}bin_intermediate_files/my.root" -chrom 1 2 3 4 -tree ${INPUT_BAMS_FOLDER} -unique && \
    cnvnator -root "${sample_id}_${bin_size}bin/${sample_id}_${bin_size}bin_intermediate_files/my.root" -chrom 1 2 3 4 -his ${bin_size} -d "${REF_CHROMOSOMES_FILEPATH}" > "${sample_id}_${bin_size}bin/${sample_id}_${bin_size}bin_intermediate_files/my.his" && \
    cnvnator -root "${sample_id}_${bin_size}bin/${sample_id}_${bin_size}bin_intermediate_files/my.root" -chrom 1 2 3 4 -stat ${bin_size}  > "${sample_id}_${bin_size}bin/${sample_id}_${bin_size}bin_intermediate_files/my.stats" && \
    cnvnator -root "${sample_id}_${bin_size}bin/${sample_id}_${bin_size}bin_intermediate_files/my.root" -chrom 1 2 3 4 -eval ${bin_size}  > "${sample_id}_${bin_size}bin/${sample_id}_${bin_size}bin_intermediate_files/my.eval" && \
    cnvnator -root "${sample_id}_${bin_size}bin/${sample_id}_${bin_size}bin_intermediate_files/my.root" -chrom 1 2 3 4 -partition ${bin_size}  > "${sample_id}_${bin_size}bin/${sample_id}_${bin_size}bin_intermediate_files/my.partition" &&\
    cnvnator -root "${sample_id}_${bin_size}bin/${sample_id}_${bin_size}bin_intermediate_files/my.root"  -chrom 1 2 3 4 -call ${bin_size}  > "${sample_id}_${bin_size}bin/${sample_id}_${bin_size}bin_CNVs.out" && \
    perl /opt/build/CNVnator_v0.3.3/cnvnator2VCF.pl "${sample_id}_${bin_size}bin/${sample_id}_${bin_size}bin_CNVs.out" > "${sample_id}_${bin_size}bin/${sample_id}_${bin_size}bin_CNVs.vcf" && \
    cp -r "${sample_id}_${bin_size}bin" "${OUT_DIR}"
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
      --input INPUT_BAMS_FOLDER="${INPUT_BAMS_FOLDER}" \
      --input-recursive REF_CHROMOSOMES_FILEPATH="${REF_CHROMOSOMES_FILEPATH}" \
      --output-recursive OUT_DIR="${OUT_DIR}" \
      --image ${IMAGE} \
      --command '${script}' \
      --min-ram 40 \
      --min-cores 2 \
  `
  // const cmd = `sh ${__base}/scripts/CNVnator_SingleSample.sh 1 2 3 4`
  return cmd
}
module.exports = {
  getAllJobs,
  launchFastqtosam,
  launchGATK,
  launchCNVnator
}