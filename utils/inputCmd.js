var prompt = require('prompt')

function inputCmd() {
  return new Promise((resolve, reject) => {
    prompt.start()
    prompt.get(['type'], function (err, result) {
      if (err) {
        reject(err)
        return
      }
      resolve(result.type.trim())
    })
  })
}

module.exports = inputCmd
