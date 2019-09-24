const fs = require('fs')
const exec = require('child_process').exec

function get_line(text, line_no, callback) {
  console.log(text)
  var lines = text.split("\n");
  if(+line_no > lines.length){
    throw new Error('File end reached without finding line')
  }
  console.log('------------------------------')
  console.log("lines:")
  console.log(lines[+line_no])
  console.log('------------------------------')

  callback(null, lines[+line_no])
}

function execPromise(command, name, id) {
  return new Promise(function(resolve, reject) {
    exec(command, (error, stdout, stderr) => {
      // if (error) {
      //   console.log('------------------------------')
      //   console.log('error code,', error.code)
      //   // console.log('stdout,', stdout)
      //   // console.log('stderr,', stderr)
      //   console.log('------------------------------')
      //   reject(stderr)
      //   return null
      // }
      // fs.appendFileSync(`${__base}/logs/${name}-stderr-${id}.txt`, stderr, function(err) {
      //   if(err) {
      //     return console.error(err)
      //   }
      //   console.error(`❌error appeared when executing "${cmd}!"`)
      // })
      // fs.appendFileSync(`${__base}/logs/${name}-stdout-${id}.txt`, stdout, function(err) {
      //   if(err) {
      //     return console.log(err)
      //   }
      //   console.log(`✅"${cmd}!" executed successfully. Log file saved. `)
      // })
      if (error) {
        console.warn(error)
        reject({ success: false, error: stderr })
      }
      resolve(stdout ? { success: true, result: stdout } : { success: false, error: stderr} )
    })
  })
}

module.exports = {
  execPromise
}