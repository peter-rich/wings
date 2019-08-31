exports.BRAND_URL = 'http://med.stanford.edu/scgpm.html'
exports.BASE_API_URL = '/api'
exports.PORT = 8081
exports.AUTH_FILE_FIELDNAME = 'authFile'

exports.PUBLIC_ROUTES = {
  FASTQ_TO_SAM: '/job/fastqtosam',
  FASTQ_TO_SAM_50G: '/job/fastqtosam50g',
  GATK: '/job/gatk',
  CNVNATOR: '/job/cnvnator',
  MONITOR: '/monitor'
}

exports.API_ROUTES = {
  FASTQ_TO_SAM: "/fastqtosam",
  GATK: "/gatk",
  CNVNATOR: '/cnvnator',
  JOBS: "/jobs",
  UPDATE_JOBS: "/update_jobs",
  LOG_IN: "/log_in",
  LOG_OUT: "/log_out"
}
