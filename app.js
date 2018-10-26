const logger = require('log4js').getLogger()
logger.level = 'debug'
const find = require('lodash/find')
const inputCmd = require('./utils/inputCmd')
const { google } = require('googleapis')
const { queryBox, getReportDate } = require('./utils/date')
const { sendMessageToChatwork } = require('./chatwork')
const chatworkAccounts = require('./accounts')
const createMessage = require('./createMessage')

async function app(auth) {
  const gmail = google.gmail({ version: 'v1', auth })
  const reportDate = getReportDate()
  logger.debug('Get report on:', reportDate.format('DD MMM YYYY'))
  const list = await getListMessages(gmail, reportDate)
  const array = list.map(async item => getMessage(gmail, item))
  const users = await Promise.all(array)
  logger.debug('Would you like to send message to chatwork? (y/n)')
  // const type = await inputCmd()
  // if (type.toUpperCase() !== 'Y') return
  const chatworkUsers = mapChatworkId(users)
  const reportGroup = createMessage(chatworkUsers, reportDate)
  logger.debug(reportGroup)
  const result = sendMessageToChatwork(reportGroup, reportDate)
}

function getMessage(gmail, item) {
  return new Promise((resolve, reject) => {
    gmail.users.messages.get(
      {
        userId: 'me',
        id: item.id,
        format: 'full',
      },
      (err, res) => {
        if (err) {
          logger.debug('The API returned an error: ', err)
          reject(err)
          return
        }
        const subject = find(res.data.payload.headers, { name: 'Subject' }).value
        const date = find(res.data.payload.headers, { name: 'Date' }).value
        resolve({ name: formatName(subject), date })
      }
    )
  })
}


function mapChatworkId(users) {
  const chatworkUser = users.map(user => {
    const username = user.name.replace(/\./g, ' ')
    const chatwork = find(chatworkAccounts, account => account.name.toUpperCase() === username.toUpperCase())
    return { ...user, chatwork }
  })
  return chatworkUser
}

module.exports = app
