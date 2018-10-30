const moment = require('moment')

/**
 * 
 * on time : From 11h -> 24h in the day
 * late : From 24h in the next day to 9h
 * miss else case
 * 
 */
function queryBox(date) {
  const day = moment(date)
  const after = day.format('YYYY/MM/DD')
  const before = day.add(2, 'days').format('YYYY/MM/DD')
  const sub = `[FE][Daily Report]`
  return `subject:${sub} before:${before} after:${after} To:frontend@framgia.com`
}

module.exports.queryBox = queryBox