const { isLate } = require('./date')

function getListUserReported(users, reportDate) {
  const ontime = []
  const late = []
  const miss = []
  users.forEach(user => {
    const { date } = user
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
  return { ontime, late, miss }
}

function createMessageText(reportGroup, reportDate) {
  const time = reportDate.format('DD MMM YYYY')
  const { late, ontime, miss } = getListUserReported(reportGroup, reportDate)
  const total = late.length + ontime.length + miss.length
  const point = ontime.length - miss.length * 2 - late.length
  const message = `[info][title]Daily Report ${time}[/title]Total: ${total} Point: ${point}
    [title]Report On time: ${ontime.length}[/title] ${ontime.map(user => `[To:${user.account.aid}]`).join(' ')}
    [title]Late: ${late.length}[/title] ${late.map(user => `[To:${user.account.aid}]`).join(' ')}
    [title]Miss: ${miss.length}[/title] ${miss.map(user => `[To:${user.account.aid}]`).join(' ')}
[/info]`
  return message
}

module.exports = createMessageText
