const express = require('express')
const log = require('debug')('app:server')
const app = express()
const morgan = require('morgan')
const api = require('./api')
const cors = require('cors')
const bodyParser = require('body-parser')
const path = require('path')

const PORT = process.env.PORT || 3000
const root = path.join(__dirname, 'build/')

app.use(express.static(root))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())
app.use(morgan('tiny'))


app.use('/api', api)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build/index.html'))
})

if (process.env.NODE_ENV === 'development') {
  app.listen(PORT, () => log(`Example app listening on port ${PORT}!`))
} else {
  require('dns').lookup(require('os').hostname(), function (err, add, fam) {
    app.listen(PORT, add, () => log(`Example app listening on port ${add} : ${PORT}!`))
  })
}
