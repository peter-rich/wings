global.__base = __dirname
// Modules
const colorizedMorgan = require('./serverUtils/colorizedMorgan')
const path = require('path')
const express = require('express')
const app = express()
const config = require(`${__base}/js/src/config.json`)
const errorhandler = require('errorhandler')
const bodyParser = require('body-parser')
const initDB = require('./database/initDB')
const api = require('./controllers/api')
// Init Database
initDB()
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