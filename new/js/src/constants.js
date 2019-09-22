export const BRAND_URL = 'http://med.stanford.edu/scgpm.html';
export const BASE_API_URL = '/api';
export const AUTH_FILE_FIELDNAME = 'authFile';
export const ANNOTATE_TYPES = ['variant', 'generic'];

export const GENE_MODES = [
  { key: 'UCSC_Ref_Gene', displayName: 'UCSC_Ref_Gene' }
];

export const REGIONS = [
  // { key: 'asia-east1', displayName: 'asia-east1 (Taiwan)' },
  // { key: 'asia-east2', displayName: 'asia-east2 (Hong Kong)' },
  // { key: 'asia-northeast1', displayName: 'asia-northeast1 (Tokyo)' },
  // { key: 'asia-northeast2', displayName: 'asia-northeast2 (Osaka)' },
  // { key: 'asia-south1', displayName: 'asia-south1 (Mumbai)' },
  // { key: 'asia-southeast1', displayName: 'asia-southeast1 (Singapore)' },
  // { key: 'australia-southeast1', displayName: 'australia-southeast1 (Sydney)' },
  // { key: 'europe-north1', displayName: 'europe-north1 (Finland)' },
  // { key: 'europe-west1', displayName: 'europe-west1 (Belgium)' },
  // { key: 'europe-west2', displayName: 'europe-west2 (London)' },
  // { key: 'europe-west3', displayName: 'europe-west3 (Frankfurt)' },
  // { key: 'europe-west4', displayName: 'europe-west4 (Netherlands)' },
  // { key: 'europe-west6', displayName: 'europe-west6 (Zürich)' },
  { key: 'northamerica-northeast1', displayName: 'northamerica-northeast1 (Montréal)' },
  { key: 'southamerica-east1', displayName: 'southamerica-east1 (São Paulo)' },
  { key: 'us-central1', displayName: 'us-central1 (Iowa)' },
  { key: 'us-east1', displayName: 'us-east1 (South Carolina)' },
  { key: 'us-east4', displayName: 'us-east4 (Northern Virginia)' },
  { key: 'us-west1', displayName: 'us-west1 (Oregon)' },
  { key: 'us-west2', displayName: 'us-west2 (Los Angeles)' }
];

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
