exports.BRAND_URL = 'http://med.stanford.edu/scgpm.html'
exports.BASE_API_URL = '/api'
exports.PORT = 8081
exports.AUTH_FILE_FIELDNAME = 'authFile'

exports.PUBLIC_ROUTES = {
  FASTQ_TO_SAM: '/job/fastqtosam',
  FASTQ_TO_SAM_50G: '/job/fastqtosam50g',
  GATK: '/job/gatk',
  CNVNATOR: '/job/cnvnator',
  ANNOTATION_HIVE: '/job/annotation_hive',
  MONITOR: '/monitor'
}

exports.API_ROUTES = {
  FASTQ_TO_SAM: "/fastqtosam",
  GATK: "/gatk",
  CNVNATOR: '/cnvnator',
  ANNOTATION_HIVE: '/annotation_hive',
  JOBS: "/jobs",
  UPDATE_JOBS: "/update_jobs",
  LOG_IN: "/log_in",
  LOG_OUT: "/log_out"
}
