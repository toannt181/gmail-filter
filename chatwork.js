require('dotenv').load()
const logger = require('log4js').getLogger()
const Request = require('./utils/request')

function createMessage(chatworkUsers) {
  const message = `
  [info][title]Hello[/title]
  ${chatworkUsers.map(user => `[To:${user.aid}] ${user.name}`)}
  [/info]
  `
  return message
}


function sendMessageToChatwork(chatworkUsers) {
  Request
    .post({
      url: `https://api.chatwork.com/v2/rooms/${process.env.CHATWORK_ROOM_ID}/messages`,
      headers: {
        'X-ChatWorkToken': process.env.CHATWORK_TOKEN,
      },
      params: { body: createMessage(chatworkUsers) }
    })
    .then(() => {
      logger.debug('Send messsage successfully')
    })
    .catch(err => console.log(err.message))
}

function getRoomList() {
  Request
    .get({
      url: 'https://api.chatwork.com/v2/rooms',
      headers: {
        'X-ChatWorkToken': process.env.CHATWORK_TOKEN,
      },
    })
    .then(result => {
      console.log(result)
    })
}

module.exports.sendMessageToChatwork = sendMessageToChatwork
