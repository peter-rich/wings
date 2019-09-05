const Sequelize = require('sequelize')
const db = require('../database/database')

const Model = Sequelize.Model
class Job extends Model {}

Job.init({
  // attributes
  job_id: {
    type: Sequelize.STRING,
    allowNull: false,
    primaryKey: true
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  status: {
    type: Sequelize.STRING,
    allowNull: false
  },
  gs_link: {
    type: Sequelize.STRING,
    allowNull: false
  },
  created_at: {
    type: Sequelize.DATE,
    allowNull: false
  },
  finished_at: {
    type: Sequelize.DATE,
    allowNull: false
  }
}, {
  sequelize: db,
  modelName: 'job',
  // options
  timestamps: true,
  createdAt: 'record_created_at',
  updatedAt: 'record_updated_at',
})

async function createTable() {
  const timestamp = Date.now()
  const singleJob = {
    job_id: timestamp,
    name: timestamp,
    status: timestamp,
    created_at: timestamp,
    finished_at: timestamp,
    gs_link: timestamp
  }
  try {
    await Job.sync({ force: false }).then(() => {
      // Now the `jobs` table in the database corresponds to the model definition
      return Job.create(singleJob)
    })

    Job.destroy({
      where: singleJob
    })
  } catch(err) {
    console.error(err)
  }
}

createTable()

module.exports = Job