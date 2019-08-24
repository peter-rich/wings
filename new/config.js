const DB_FILE_DEV = './database/wings-dev.sqlite3'
const DB_FILE_PROD = './database/wings-prod.sqlite3'

// Exports
exports.DB_FILE = process.env.NODE_ENV === 'development' ? DB_FILE_DEV : DB_FILE_PROD
exports.BRAND_URL = 'http://med.stanford.edu/scgpm.html'
exports.BASE_API_URL = '/api'
exports.PORT = 8081

exports.PUBLIC_ROUTES = {
  FASTQ_TO_SAM: '/jobs/fastqtosam',
  FASTQ_TO_SAM_50G: '/jobs/fastqtosam50g',
  GATK: '/jobs/gatk',
  CNVNATOR: '/jobs/cnvnator',
  MONITOR: '/monitor'
}

exports.API_ROUTES = {
  FASTQ_TO_SAM: "/fastqtosam",
  GATK: "/gatk",
  CNVNATOR: '/cnvnator',
  JOBS: "/jobs",
  AUTH: "/authenticate"
}
