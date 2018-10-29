const find = require('lodash/find')
const { isLate } = require('./date')

function getListUserReported(users, reportDate, absences) {
  const ontime = []
  const late = []
  const miss = []
  const absent = []
  users.forEach(user => {
    const { date, name } = user
    const findAbsent = find(absences, u => name.replace(/\s+/gi, '').toUpperCase() === u.label.replace(/\s+/gi, '').toUpperCase())
    if (findAbsent) {
      user.absent = true
      absent.push(user)
      return
    }
    if (!date) {
      miss.push(user)
      return
    }
    if (isLate(date, reportDate)) {
      late.push(user)
    } else {
      ontime.push(user)
    }
  })
  return { ontime, late, miss, absent }
}

function createMessageText(reportGroup, reportDate, absences) {
  const time = reportDate.format('DD MMM YYYY')
  const { late, ontime, miss, absent } = getListUserReported(reportGroup, reportDate, absences)
  const total = late.length + ontime.length + miss.length
  const point = ontime.length - miss.length * 2 - late.length
  const message = `[info][title]Daily Report ${time}[/title]Total: ${total} Point: ${point}
    [title]Report On time: ${ontime.length}[/title] ${ontime.map(user => `[To:${user.account.aid}]`).join(' ')}
    [title]Late: ${late.length}[/title] ${late.map(user => `[To:${user.account.aid}]`).join(' ')}
    [title]Miss: ${miss.length}[/title] ${miss.map(user => `[To:${user.account.aid}]`).join(' ')}
    [title]Absent: ${absent.length}[/title] ${absent.map(user => `[To:${user.account.aid}]`).join(' ')}
[/info]`
  return message
}

module.exports = createMessageText
