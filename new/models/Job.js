const Sequelize = require('sequelize')
const db = require('../database/database')

const Model = Sequelize.Model
class Job extends Model {}
Job.init({
  // attributes
  job_id: {
    type: Sequelize.STRING,
    allowNull: false
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
    type: Sequelize.STRING,
    allowNull: false
  },
  finished_at: {
    type: Sequelize.STRING,
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

Job.sync({ force: false }).then(() => {
  // Now the `jobs` table in the database corresponds to the model definition
  return Job.create({
    job_id: "jahsd",
    name: "129hdas",
    status: 'suceess',
    created_at: '18273821312',
    finished_at: '0103813912',
    gs_link: 'asdbamnsdb^^^^^^'
  })
})
// Create a new job
Job.create({ job_id: "kasjdasd", name: "Doe", status: 'failure', created_at: 'alsdkasd', finished_at: 'asdjasdasd', gs_link: 'asdlakdjasj' }).then(job => {
  console.log("Jane's auto-generated ID:", job.id)
})

module.exports = Job