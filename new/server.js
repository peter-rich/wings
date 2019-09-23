global.__base = __dirname
// Modules
const config = require(`${__base}/config-server`)
const colorizedMorgan = require('./serverHelpers/colorizedMorgan')
const path = require('path')
const express = require('express')
const app = express()
const cookieParser = require('cookie-parser')
const errorhandler = require('errorhandler')
const bodyParser = require('body-parser')
const api = require(`${__base}/controllers/api`)
const _init = require(`${__base}/_init`)

// Initialization
_init(app)

// Parse request body
app.use(cookieParser())
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
app.use(config.BASE_API_URL, api)
// Default route
app.use('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/js/build/index.html'))
})
// Init server
app.listen(config.PORT, () => console.log(`AQT Node server listening on port ${config.PORT}!\n\n`))