const Sequelize = require('sequelize')
const { DB_FILE } = require('../config')

module.exports = new Sequelize({
  dialect: 'sqlite',
  storage: `./${DB_FILE}`,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
})