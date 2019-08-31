global.__base = __dirname
// Modules
const config = require(`${__base}/config`)
const colorizedMorgan = require('./serverHelpers/colorizedMorgan')
const path = require('path')
const express = require('express')
const session = require('express-session')
const app = express()
const cookieParser = require('cookie-parser')
const errorhandler = require('errorhandler')
const bodyParser = require('body-parser')
const db = require(`${__base}/database/database.js`)
const api = require(`${__base}/controllers/api`)
// const scheduler = require(`${__base}/scheduler`)
// Init scheduler
// scheduler.start()
app.use(cookieParser())
console.log(new Date())
app.use(session({
  'secret': '343ji43j4n3jn4jk3n',
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
// Parse request body
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
// Enable logging
app.use(colorizedMorgan)
app.use(express.static('js/build'))
// Enable error handler for development environment
if (process.env.NODE_ENV !== 'prod') {
  app.use(errorhandler());
}
// Routes
app.use('/api', api)
// Default route
app.use('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/js/build/index.html'))
})
// Init server
app.listen(config.PORT, () => console.log(`AQT Node server listening on port ${config.PORT}!\n\n`))