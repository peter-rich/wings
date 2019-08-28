const getAllJobs = (GOOGLE_CRED_PATH, GOOGLE_CRED_FILE, project_id) => (
  `export GOOGLE_APPLICATION_CREDENTIALS=${GOOGLE_CRED_PATH}/${GOOGLE_CRED_FILE} && \
dstat --provider google-v2 --project ${project_id} --status '*' \
--full | grep  "job-id\\|job-name\\|status:\\|creat\\|end-time\\|logging: g"`
)


const launchFastqtosam = ({
  GOOGLE_CRED_FILE_PATH,
  project_id,
  time_zone,
  log_file,
  input_file_1,
  input_file_2,
  output_file,
  sample_name,
  read_group,
  platform}) => (
  `export GOOGLE_APPLICATION_CREDENTIALS=${GOOGLE_CRED_FILE_PATH} && \
  dsub  --project ${project_id} --min-cores 1 --min-ram 7.5 \
  --preemptible --boot-disk-size 20 --disk-size 200  --zones ${time_zone} \
  --logging ${log_file} --input FASTQ_1=${input_file_1} --input FASTQ_2=${input_file_2} \
  --output UBAM=${output_file} --env SM=${sample_name}  \
  --image broadinstitute/gatk:4.1.0.0 --env RG=${read_group} --env PL=${platform} \
  --command '/gatk/gatk --java-options "-Xmx8G -Djava.io.tmpdir=bla" ` +
  "FastqToSam -F1 ${FASTQ_1} -F2 ${FASTQ_2} -O ${UBAM} --SAMPLE_NAME ${SM} -RG ${RG} -PL ${PL}'"
)

module.exports = {
  getAllJobs,
  launchFastqtosam
}