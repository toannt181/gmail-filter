const moment = require('moment')

function queryBox(date) {
  const time = moment(date).format('DD MMM YYYY')
  const sub = `[FE][Daily Report]`
  return `subject:${sub} ${time} To:frontend@framgia.com`
}

module.exports.queryBox = queryBox