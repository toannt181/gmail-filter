const { queryBox } = require('./helper')
// const find = require('lodash/find')

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

function getMessageDetail(gmail, item) {
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
        resolve(data)
      }
    )
  })
}

function formatName(subject) {
  return /.+\s+(\S+)$/.exec(subject)[1]
}

module.exports = { getMessage, getMessageDetail }
