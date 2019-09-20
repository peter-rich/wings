const fs = require('fs')
const exec = require('child_process').exec

function execPromise(command, name, id) {
  return new Promise(function(resolve, reject) {
      // setTimeout(() => {
      //   resolve('Dummy message, yeehaw 🤠')
      // }, 3000)
      exec(command, (error, stdout, stderr) => {
          if (error) {
              reject(error)
              return null
          }
          fs.appendFileSync(`${__base}/logs/${name}-stderr-${id}.txt`, stderr, function(err) {
            if(err) {
              return console.error(err)
            }
            console.error(`❌error appeared when executing "${cmd}!"`)
          })
          fs.appendFileSync(`${__base}/logs/${name}-stdout-${id}.txt`, stdout, function(err) {
            if(err) {
              return console.log(err)
            }
            console.log(`✅"${cmd}!" executed successfully. Log file saved. `)
          })
          resolve(stdout)
      })
  })
}

module.exports = {
  execPromise
}