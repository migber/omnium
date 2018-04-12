'use strict'
require('dotenv').config()
const express = require('express')
const cors = require('cors')
const request = require('request')

const app = express()
const db = require('../config/connectDB')
// const usersController = require('./controllers/user')
const rr = require('./helpers/excelParsing')
// const server = require('http').Server(app)
// const io = require('socket.io')(server)

const port = 8080

console.log('listening on port ', port)

db()
app.use(cors())
app.get('/', (req, res) => res.send('Hello World!'))
// app.post('/api/users/exists', usersController.findUser)
// app.post('/api/users/createLogged', usersController.createLoggedUser)
const server = app.listen(process.env.PORT, () => console.log(`Example app listening on port ${process.env.PORT}!`))
const io = require('socket.io').listen(server)

app.use(require('body-parser').json({ type: 'application/json' }))
app.use('/', require('./routes/index'))

io.on('connection', (client) => {
  client.on('subscribeToTimer', (interval) => {
    console.log('client is subscribing to timer with interval ', interval)
    setInterval(() => {
      client.emit('timer', new Date())
    }, interval)
  })
  client.on('SEND_MESSAGE', async (data) => {
    console.log(data)
    io.emit('RECEIVE_MESSAGE', data.totalPoints)
  })
})

