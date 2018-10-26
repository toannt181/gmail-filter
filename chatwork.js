require('dotenv').load()
const axios = require('axios')

function sendMessageToChatwork(message) {
  return axios
    ({
      method: 'POST',
      url: `https://api.chatwork.com/v2/rooms/${process.env.CHATWORK_ROOM_ID}/messages`,
      headers: {
        'X-ChatWorkToken': process.env.CHATWORK_TOKEN,
      },
      params: { body: message }
    })
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
