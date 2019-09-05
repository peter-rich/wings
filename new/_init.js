const session = require('express-session')
const uuid = require('uuid')
const db = require(`${__base}/database/database.js`)
const importAnnotations = require(`${__base}/tasks/importAnnotations.js`)

const _init = (app) => {
  // Init tasks
  importAnnotations()

  // const scheduler = require(`${__base}/scheduler`)
  // Init scheduler
  // scheduler.start()
  app.use(session({
    secret: uuid.v1(),
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60,
      sameSite: true,
      secure: false,
    }
  }))

  db.authenticate()
    .then(() => {
      console.log('Connection has been established successfully.')
    })
    .catch(err => {
      console.error('Unable to connect to the database:', err)
    })
}

module.exports = _init