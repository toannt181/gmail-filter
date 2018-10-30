const moment = require('moment')
moment.locale('en')

function getDate() {
  const now = moment()
  const today = now.format('YYYY/MM/DD 08:00')
  const yesterday = now.subtract(1, 'day').format('YYYY/MM/DD 08:00')
  return `after:${yesterday} before:${today}`
}

function getReportDate() {
  const now = moment().hour(0).minute(0).second(0)
  let subtractDay = 1
  if (now.weekday() === 0) {
    subtractDay = 2
  }
  if (now.weekday() === 1) {
    subtractDay = 3
  }
  return now.subtract(subtractDay, 'day')
}

function isLate(date, reportDate) {
  return moment(date).diff(moment(reportDate).add(1, 'days').hour(0).minute(0).second(0), 'minutes') > 0
}


module.exports.getDate = getDate
module.exports.getReportDate = getReportDate
module.exports.isLate = isLate
