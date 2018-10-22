const logger = require('log4js').getLogger()
const moment = require('moment')

const LATE_AFTER_HOURS = 12

function createMessage(users, reportDate) {
  const onTime = []
  const late = []
  const miss = []
  users.forEach(user => {
    const { date } = user
    if (moment(date).diff(moment(reportDate), 'hours') > LATE_AFTER_HOURS) {
      late.push(user)
    } else {
      onTime.push(user)
    }
  })
  return { onTime, late, miss }
}

module.exports = createMessage
