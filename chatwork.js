require('dotenv').load()
const logger = require('log4js').getLogger()
const Request = require('./utils/request')
const moment = require('moment')

// [Quote aid=1474365 time=1540178318][info][title]Daily Report 19 Oct 2018[/title]Total: 19 Point: 14

// [title]Report On time: 17[/title][To:3038954] [To:3064591] 

// [title]Late: 1[/title] [To:2981520] 

// [title]Miss: 1[/title] [To:2274061] Do Viet Tung

// [/info][/Quote]


function createMessage(reportGroup, reportDate) {
  const time = reportDate.format('DD MMM YYYY')
  const { late, onTime, miss } = reportGroup
  const total = late.length + onTime.length + miss.length
  const point = onTime.length - miss.length * 2 - late.length
  const message = `
    [info][title]Daily Report ${time}[/title]Total: ${total} Point: ${point}
    [title]Report On time: ${onTime.length}[/title] ${onTime.map(user => `[To:${user.chatwork.aid}] `)}
    [title]Late: ${late.length}[/title] ${late.map(user => `[To:${user.chatwork.aid}] `)}
    [title]Miss: ${miss.length}[/title] ${miss.map(user => `[To:${user.chatwork.aid}] `)}
    [/info]
  `
  return message
}

function sendMessageToChatwork(reportGroup, reportDate) {
  const body = createMessage(reportGroup, reportDate)
  Request
    .post({
      url: `https://api.chatwork.com/v2/rooms/${process.env.CHATWORK_ROOM_ID}/messages`,
      headers: {
        'X-ChatWorkToken': process.env.CHATWORK_TOKEN,
      },
      params: { body }
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
