const Sequelize = require('sequelize')
const db = require('../database/database')
const uuid = require('uuid')

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
    allowNull: true
  },
  status: {
    type: Sequelize.STRING,
    allowNull: true
  },
  gs_link: {
    type: Sequelize.STRING,
    allowNull: true
  },
  created_at: {
    type: Sequelize.DATE,
    allowNull: true
  },
  finished_at: {
    type: Sequelize.DATE,
    allowNull: true
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
  const id = uuid.v1()
  const singleJob = {
    job_id: id,
    name: id,
    status: id,
    gs_link: id
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