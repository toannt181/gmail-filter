const { queryBox } = require('./helper')
const log = require('debug')('app:gmailApi')
const moment = require('moment')

function getMessage(gmail, date) {
  return new Promise((resolve, reject) => {
    gmail.users.messages.list(
      {
        userId: 'me',
        q: queryBox(date),
        maxResults: 999,
      },
      (err, res) => {
        if (err) {
          reject(err)
          return
        }
        resolve(res.data.messages)
      }
    )
  })
}

function getMessageDetail(gmail, item, date) {
  return new Promise((resolve, reject) => {
    gmail.users.messages.get(
      {
        userId: 'me',
        id: item.id,
        format: 'full',
      },
      (err, res) => {
        if (err) {
          reject(err)
          return
        }
        const data = {}
        res.data.payload.headers.forEach(header => {
          data[header.name] = header.value
        })
        const checkReportBelongToday = moment(date).hours(11).minutes(45).seconds(0).diff(moment(data.Date)) < 0
        log('Mail From %s Date %s isBelong %s', data.From, data.Date, checkReportBelongToday)
        if (!checkReportBelongToday) return
        resolve(data)
      }
    )
  })
}

function formatName(subject) {
  return /.+\s+(\S+)$/.exec(subject)[1]
}

module.exports = { getMessage, getMessageDetail }
