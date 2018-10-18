require('dotenv').load()
const logger = require('log4js').getLogger()
const Request = require('./utils/request')

function createMessage(list) {
  const message = `
  [info][title]Hello[/title]
  [To:2524834] Nguyen Van Thang

  [title]List user detected:[/title]
  ${list.toString(', ')}
  [/info]
  `
  return message
}


function sendMessageToChatwork(list) {
  Request
    .post({
      url: `https://api.chatwork.com/v2/rooms/${process.env.THANG_ID}/messages`,
      headers: {
        'X-ChatWorkToken': process.env.CHATWORK_TOKEN,
      },
      params: { body: createMessage(list) }
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
