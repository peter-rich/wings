const cron = require('cron').CronJob
const updateJobs = require(`${__base}/tasks/updateJobs`)

// new cron('* * * * * *', function() {
//   console.log('You will see this message every second')
// }, null, true, 'America/Los_Angeles')


function start() {
  updateJobs()
}

module.exports = {
  start
}