const moment = require('moment')

function queryBox(date) {
  const day = moment(date)
  const after = day.format('YYYY/MM/DD')
  const before = day.add(1, 'days').format('YYYY/MM/DD')
  const sub = `[FE][Daily Report]`
  return `subject:${sub} before:${before} after:${after} To:frontend@framgia.com`
}

module.exports.queryBox = queryBox