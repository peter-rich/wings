export const BRAND_URL = 'http://med.stanford.edu/scgpm.html';
export const BASE_API_URL = '/api';
export const PORT = 8081;
export const AUTH_FILE_FIELDNAME = 'authFile';
export const ANNOTATE_TYPES = ['variant', 'generic'];

export const SERVICE_ACCOUNT_KEYS = [
  "type",
  "project_id",
  "private_key_id",
  "private_key",
  "client_email",
  "client_id",
  "auth_uri",
  "token_uri",
  "auth_provider_x509_cert_url",
  "client_x509_cert_url"
];

export const PUBLIC_ROUTES = {
  FASTQ_TO_SAM: '/job/fastqtosam',
  FASTQ_TO_SAM_50G: '/job/fastqtosam50g',
  GATK: '/job/gatk',
  CNVNATOR: '/job/cnvnator',
  ANNOTATION_HIVE_IMPORT: '/job/annotation_hive_import',
  ANNOTATION_HIVE_PROCESS: '/job/annotation_hive_process',
  MONITOR: '/monitor'
};

export const API_ROUTES = {
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
};
