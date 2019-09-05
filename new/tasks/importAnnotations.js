const fs = require('fs')
const d3 = require('d3-dsv')
const { GOOGLE_CRED_PATH, GOOGLE_CRED_FILE } = require(`${__base}/config-server`)
const Annotation = require(`${__base}/models/Annotation`)

const runScript = async (client_id) => {
  try {
    fs.readFile(`${__base}/database/annotations.tsv`, 'utf8', (err, data) => {
      data = d3.tsvParse(data)

      data.forEach(anno => {
        delete anno.index
        console.log(anno)
        Annotation.findOne({ where: anno })
          .then(function(obj) {
            if (obj) {
              obj.update(anno)
            } else {
              Annotation.create(anno)
            }
          })
          .then(result => {
            console.log(result)
          })
          .catch(err => {
            console.error(err)
          })
      })
    })
  } catch (err) {
    console.error(err.message)
  }
}

module.exports = runScript