const { google } = require('googleapis')
const getAuth = require('../auth')
const express = require('express')
const router = express.Router()
const log = require('debug')('app:api')
const { getMessage, getMessageDetail } = require('./gmailApi')
const frontenders = require('../frontender.json').filter(item => !item.disable)
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
    const array = list.map(async item => getMessageDetail(gmail, item, req.body.date))
    const headerUsers = await Promise.all(array)
    const users = frontenders.map(frontender => {
      const name = frontender.label.replace(/\s+/ig, '').toUpperCase()
      const mail = find(headerUsers, item => {
        const convertedName = /<(.+)@.+>/.exec(item.From)[1].replace(/\.+/ig, '').toUpperCase()
        return convertedName === name
      })
      const { Date: date, From: from, Subject: subject } = mail || {}
      return { date, from, subject, account: frontender, name: frontender.label }
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

router.get('/chatworkList', async (req, res) => {
  try {
    res.send(frontenders)
  } catch (e) {
    log(e)
    res.status(500).end()
  }
})

module.exports = router
