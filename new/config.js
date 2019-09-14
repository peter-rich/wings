exports.BRAND_URL = 'http://med.stanford.edu/scgpm.html'
exports.BASE_API_URL = '/api'
exports.PORT = 8081
exports.AUTH_FILE_FIELDNAME = 'authFile'

exports.ANNOTATE_TYPES = ['variant', 'generic']

exports.PUBLIC_ROUTES = {
  FASTQ_TO_SAM: '/job/fastqtosam',
  FASTQ_TO_SAM_50G: '/job/fastqtosam50g',
  GATK: '/job/gatk',
  CNVNATOR: '/job/cnvnator',
  ANNOTATION_HIVE_IMPORT: '/job/annotation_hive_import',
  ANNOTATION_HIVE_PROCESS: '/job/annotation_hive_process',
  MONITOR: '/monitor'
}

exports.API_ROUTES = {
  FASTQ_TO_SAM: "/fastqtosam",
  GATK: "/gatk",
  CNVNATOR: '/cnvnator',
  ANNOTATION_IMPORT: '/annotation_import',
  ANNOTATION_PROCESS: '/annotation_process',
  ANNOTATION_LIST: '/annotation_list',
  JOBS: "/jobs",
  UPDATE_JOBS: "/update_jobs",
  REQUEST_USER: "/request_user",
  LOG_IN: "/log_in",
  LOG_OUT: "/log_out"
}
