const sqlite3 = require('sqlite3').verbose()
const fs = require('fs')

const { DB_FILE } = require('../config.json')

function initDB() {
  try {
    if (fs.existsSync(DB_FILE)) {
      console.log('✅Database exists. Good to go!')
    } else {
      console.log('❌Database DOESN\'T exist. Creating a new empty database now...')
      fs.writeFile(DB_FILE, '', 'utf-8', function (err) {
        if (err) throw err
        console.log(`Database file "${DB_FILE}" is successfully created.`)
      })
    }
  } catch(err) {
    console.error(err)
  }

  let db = new sqlite3.Database(DB_FILE, sqlite3.OPEN_CREATE, (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Connected to the record database.');
  });

  let sql = `CREATE TABLE test (
    job_id VARCHAR(255),
    job_name VARCHAR(255),
    status VARCHAR(16),
    last_update TIMESTAMP,
    create_time TIMESTAMP,
    storage_link VARCHAR(255)
  )`

  db.run(sql, function(err) {
    if (err) {
      return console.log(err.message)
    }
    console.log('table created')
  })

  db.close()
}

module.exports = initDB