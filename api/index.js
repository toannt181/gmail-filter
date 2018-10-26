const { google } = require('googleapis')
const getAuth = require('../auth')
const express = require('express')
const router = express.Router()
const log = require('debug')('app:api')
const { getMessage, getMessageDetail } = require('./gmailApi')
const accounts = require('../accounts.json')
const find = require('lodash/find')
const { sendMessageToChatwork } = require('../chatwork')

router.post('/getMails', async (req, res) => {
  try {
    const auth = await getAuth()
    const gmail = google.gmail({ version: 'v1', auth })
    const list = await getMessage(gmail, req.body.date)
    if (!list) {
      throw new Error('Cant find any message')
    }
    const array = list.map(async item => getMessageDetail(gmail, item))
    const headerUsers = await Promise.all(array)
    const users = headerUsers.map(user => {
      const { Date: date, From: from, Subject: subject } = user
      const convertedName = /<(.+)@.+>/.exec(from)[1].replace(/\.+/ig, '')
      const account = find(accounts, item => {
        return item.name.replace(/\s+/ig, '').toUpperCase() === convertedName.toUpperCase()
      })
      return { date, from, subject, account }
    })
    res.send(users)
  } catch (e) {
    log(e)
    res.status(500).end()
  }
})

router.post('/sendChatwork', async (req, res) => {
  try {
    const message = req.body.message
    await sendMessageToChatwork(message)
    res.send({ message: 'OK' })
  } catch (e) {
    log(e)
    res.status(500).end()
  }
})

module.exports = router
