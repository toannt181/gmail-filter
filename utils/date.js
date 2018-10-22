const moment = require('moment')
moment.locale('en')
const logger = require('log4js').getLogger()

function getDate() {
  const now = moment()
  const today = now.format('YYYY/MM/DD 08:00')
  const yesterday = now.subtract(1, 'day').format('YYYY/MM/DD 08:00')
  return `after:${yesterday} before:${today}`
}

function getReportDate() {
  const now = moment().hour(8).minute(0)
  let subtractDay = 1
  if (now.weekday() === 0) {
    subtractDay = 2
  }
  if (now.weekday() === 1) {
    subtractDay = 3
  }
  return now.subtract(subtractDay, 'day')
}

function queryBox(date) {
  const time = date.format('DD MMM YYYY')
  const sub = `[FE][Daily Report]`
  return `subject:${sub} ${time} To:frontend@framgia.com`
}

module.exports.getDate = getDate
module.exports.queryBox = queryBox
module.exports.getReportDate = getReportDate
