const moment = require('moment')

function getDate() {
  const now = moment()
  const today = now.format('YYYY/MM/DD 08:00')
  const yesterday = now.subtract(1, 'day').format('YYYY/MM/DD 08:00')
  return `after:${yesterday} before:${today}`
}

function queryBox({ day } = { day: 1 }) {
  const now = moment().subtract(1, 'day')
  // const yesterday = now.format('YYYY/MM/DD')
  const time = now.format('DD MMM YYYY')
  const sub = `[FE][Daily Report]`
  return `subject:${sub} ${time}`
}

module.exports.getDate = getDate
module.exports.queryBox = queryBox
