export const DB_FILE = './database/wings.db';
export const BRAND_URL = 'http://med.stanford.edu/scgpm.html';
export const BASE_API_URL = '/api';
export const PORT = '8081';

export const PUBLIC_ROUTES = {
  FASTQ_TO_SAM: '/jobs/fastqtosam',
  FASTQ_TO_SAM_50G: '/jobs/fastqtosam50g',
  GATK: '/jobs/gatk',
  MONITOR: '/monito'
};

export const API_ROUTES = {
  FASTQ_TO_SAM: "/fastqtosam",
  GATK: "/gatk",
  JOBS: "/jobs",
  AUTH: "/authenticate"
};
