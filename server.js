const express = require('express')
const log = require('debug')('app:server')
const app = express()
const morgan = require('morgan')
const api = require('./api')
const cors = require('cors')
const bodyParser = require('body-parser')

const PORT = process.env.PORT || 3000

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors({ origin: 'http://localhost:3000' }))
app.use(morgan('tiny'))

app.listen(PORT, () => log(`Example app listening on port ${PORT}!`))

app.use('/api', api)