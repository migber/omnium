'use strict'

const router = require('express').Router()
const { User } = require('../models/index')
const moment = require('moment')
const responseBadRequest = require('../helpers/responseHelper')
const { Op } = require('sequelize').Sequelize


async function getUsersList(req, res) {
  console.log('Getting list of users')
  User.findAll({}).then((users) => {
    res.status(200)
    res.json(users)
  }).catch((error) => {
    res.status(400)
    res.send(responseBadRequest(error))
  })
}

async function getUserLogin(req, res) {
  console.log('Get user login')
  User.findAll({
    where: {
      approved: true,
      email: req.body.email,
    },
  }).then((users) => {
    if (users.length !== 0) {
      const user = users[0]
      user.updateAttributes({
        accessToken: req.body.accessToken,
        lastlogedIn: moment().utc(),
        img: req.body.img,
        googleId: req.body.googleId,
      })
      res.status(200)
      res.json(user)
    } else {
      res.status(200)
      res.json(null)
    }
  }).catch((error) => {
    res.status(400)
    res.send(responseBadRequest(error))
  })
}

async function getUsersListNotApproved(req, res) {
  console.log('Getting list of users not approved')
  User.findAll({
    where: {
      approved: false,
    },
  }).then((users) => {
    res.status(200)
    res.json(users)
  }).catch((error) => {
    res.status(400)
    res.send(responseBadRequest(error))
  })
}

async function getUser(req, res) {
  console.log('Get user')
  const id = Number(req.params.userId)
  User.findById(id).then((user) => {
    res.json(user)
  }).catch((error) => {
    res.status(400)
    res.send(responseBadRequest(error))
  })
}

async function createUserRequest(req, res) {
  console.log('Create user request')
  console.log(req.body)
  User.findAll({
    where: {
      email: {
        [Op.eq]: req.body.email,
      },
    },
  }).then((users) => {
    if (users.length === 0) {
      User.create({
        email: req.body.email,
        approved: false,
        accessToken: null,
        lastlogedIn: null,
        firstlogedIn: moment().utc(),
        submitted: null,
        phone: req.body.phone,
        name: req.body.name,
        surname: req.body.surname,
      }).then((user) => {
        res.json(user)
      }).catch((error) => {
        res.status(400)
        res.send(responseBadRequest(error))
      })
    } else {
      res.status(400)
      res.send(responseBadRequest('User exists'))
    }
  })
}

async function createUser(req, res) {
  console.log('Create user')
  User.create({
    email: req.body.email,
    approved: false,
    accessToken: req.body.accessToken,
    lastlogedIn: req.body.lastlogedIn,
    firstlogedIn: req.body.firstlogedIn,
    submitted: req.body.submitted,
    phone: req.body.phone,
    name: req.body.name,
    surname: req.body.surname,
  }).then((user) => {
    res.json(user)
  }).catch((error) => {
    res.status(400)
    res.send(responseBadRequest(error))
  })
}

async function editUser(req, res) {
  console.log('Updating User')
  const id = Number(req.params.userId)
  User.findById(id).then((user) => {
    if (user) {
      user.updateAttributes({
        email: req.body.email,
        approved: req.body.approved,
        accessToken: req.body.accessToken,
        lastlogedIn: req.body.lastlogedIn,
        firstlogedIn: req.body.firstlogedIn,
        submitted: req.body.submitted,
        phone: req.body.phone,
        name: req.body.name,
        surname: req.body.surname,
      }).then((updatedUser) => {
        res.json(updatedUser)
        res.status(200)
      }).catch((err) => {
        res.status(400)
        res.send(responseBadRequest(err))
      })
    }
  })
}

async function updateApproveValue(req, res) {
  console.log('Approving user')
  const id = Number(req.params.userId)
  User.findById(id).then((user) => {
    if (user) {
      user.updateAttributes({
        approved: req.body.approved,
      }).then((updatedUser) => {
        res.json(updatedUser)
        res.status(200)
      }).catch((err) => {
        res.status(400)
        res.send(responseBadRequest(err))
      })
    }
  })
}

async function deleteUser(req, res) {
  console.log('Delete user')
  const id = Number(req.params.userId)
  User.destroy({ where: { id } }).then(() => {
    res.status(200)
    res.json()
  })
}

async function findUser(req, resp) {
  console.log('Logged user')
  const { user } = req.body
  console.log('Logged user')
  User.findAll({
    where: {
      accessToken: user.accessToken,
      googleId: user.googleId,
      email: user.email,
    },
  }).then(async (foundUser) => {
    console.log(`USER FOUND ${foundUser}`)
    resp.send(foundUser.length !== 0)
    resp.status(200)
  }).catch((error) => {
    resp.status(400)
    resp.send(responseBadRequest(error))
  })
}
async function createLoggedUser(req, resp) {
  console.log('Create Logged user')
  const user = req.body
  const today = moment().utc().utcOffset(120).format('YYYY-MM-DD')
  console.log('Logged user')
  User.create({
    email: user.email,
    accessToken: user.accessToken,
    lastlogedIn: today,
    firstlogedIn: today,
    googleId: user.googleId,
    img: user.img,
  }).then((createdUser) => {
    console.log('created')
    resp.json(createdUser)
    resp.status(200)
  }).catch((error) => {
    resp.status(400)
    resp.send(responseBadRequest(error))
  })
}

router.get('/api/users', getUsersList)
router.post('/api/users/login', getUserLogin)
router.get('/api/users/notApproved', getUsersListNotApproved)
router.get('/api/users/:userId', getUser)
router.post('/api/users', createUser)
router.post('/api/newUser', createUserRequest)
router.post('/api/users/exists', findUser)
router.post('/api/users/createLogged', createLoggedUser)
router.put('/api/users/:userId', editUser)
router.put('/api/users/:userId/approve', updateApproveValue)
router.delete('/api/users/:userId', deleteUser)

module.exports = {
  router,
  getUsersList,
  getUser,
  createUser,
  editUser,
  updateApproveValue,
  deleteUser,
  createLoggedUser,
  findUser,
}
