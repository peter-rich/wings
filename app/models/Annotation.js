const Sequelize = require('sequelize')
const db = require('../database/database')

const Model = Sequelize.Model
class Annotation extends Model {}

Annotation.init({
  // attributes
  source_name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  source_link: {
    type: Sequelize.STRING,
    allowNull: false
  },
  bigquery_table: {
    type: Sequelize.STRING,
    allowNull: false
  },
  type: {
    type: Sequelize.STRING,
    allowNull: false
  },
  fields: {
    type: Sequelize.STRING,
    allowNull: false
  }
}, {
  sequelize: db,
  modelName: 'annotation',
  // options
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})

async function createTable() {
  const timestamp = Date.now()
  const singleRecord = {
    source_name: timestamp,
    source_link: timestamp,
    bigquery_table: timestamp,
    type: timestamp,
    fields: timestamp
  }
  try {
    await Annotation.sync({ force: false }).then(() => {
      // Now the `annotations` table in the database corresponds to the model definition
      return Annotation.create(singleRecord)
    })

    Annotation.destroy({
      where: singleRecord
    })
  } catch(err) {
    console.error(err)
  }
}

createTable()

module.exports = Annotation