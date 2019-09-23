const DB_FILE_DEV = `${__base}/database/wings-dev.sqlite3`
const DB_FILE_PROD = `${__base}/database/wings-prod.sqlite3`
const env = process.env.NODE_ENV
exports.BASE_API_URL = '/api'
exports.PORT = env === 'development' ? 8081 : 80
// Exports
exports.GOOGLE_CRED_PATH = `${__base}/credentials`
exports.GOOGLE_CRED_FILE = 'gbsc-gcp-project-annohive-dev-2817dc37f2ed.json'
exports.DB_FILE = env === 'development' ? DB_FILE_DEV : DB_FILE_PROD
