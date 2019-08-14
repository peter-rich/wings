const morgan = require('morgan')
const path = require('path')
const express = require('express')
const app = express()
const config = require('./config.json')
const errorhandler = require('errorhandler')
const bodyParser = require('body-parser')

const ROUTES = {
  AQT_API: '/aqt/api/v1/',
  SEEKERS_NEWS: '/news/v1/',
  IDEAS: '/ideas'
}

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.set('view engine', 'pug')
app.use(morgan('common'))
app.use(express.static('js/build'))
// Enable error handler for development environment
if (process.env.NODE_ENV !== 'prod') {
  app.use(errorhandler());
}

// ROUTES
app.post('/api/fastqtosam', (req, res) => {
  console.log(req.body)
})

// Default route
app.use('/', (req, res) => {
  res.sendFile(path.join(__dirname+'/js/build/index.html'))
})

// Create server
app.listen(config.PORT, () => console.log(`AQT Node server listening on port ${config.PORT}!\n\n\n\n`))