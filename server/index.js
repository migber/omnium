'use strict'
require('dotenv').config()
const express = require('express')
const cors = require('cors')

const app = express()
const db = require('../config/connectDB')
// const usersController = require('./controllers/user')
const rr = require('./helpers/excelParsing')

db()

app.use(cors())
app.get('/', (req, res) => res.send('Hello World!'))
// app.post('/api/users/exists', usersController.findUser)
// app.post('/api/users/createLogged', usersController.createLoggedUser)
app.listen(process.env.PORT, () => console.log(`Example app listening on port ${process.env.PORT}!`))
app.use(require('body-parser').json({ type: 'application/json' }))
app.use('/', require('./routes/index'))
