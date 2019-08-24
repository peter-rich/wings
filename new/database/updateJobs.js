const updateJobs = require('cron').CronJob

const Job = require('../models/Job')

Job.findAll().then(jobs => {
  console.log("All jobs:", JSON.stringify(jobs, null, 4))
})

// new updateJobs('* * * * * *', function() {
//   console.log('You will see this message every second')
// }, null, true, 'America/Los_Angeles')

module.exports = updateJobs