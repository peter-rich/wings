const DB_FILE_DEV = `${__base}/database/wings-dev.sqlite3`
const DB_FILE_PROD = `${__base}/database/wings-prod.sqlite3`
// Exports
exports.GOOGLE_CRED_PATH = `${__base}/credentials`
exports.GOOGLE_CRED_FILE = 'gbsc-gcp-project-annohive-dev-2817dc37f2ed.json'
exports.DB_FILE = process.env.NODE_ENV === 'development' ? DB_FILE_DEV : DB_FILE_PROD
