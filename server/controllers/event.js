'use strict'

const router = require('express').Router()
const { Event, Race } = require('../models/index')
const responseBadRequest = require('../helpers/responseHelper')

async function getEventsList(req, res) {
  console.log('Getting list of events')
  Event.findAll({}).then((event) => {
    res.json(event)
  }).catch((error) => {
    res.status(400)
    res.send(responseBadRequest(error))
  })
}

async function getEvent(req, res) {
  console.log('Get event')
  const id = Number(req.params.id)
  Event.findById(id).then((event) => {
    res.json(event)
  }).catch((error) => {
    res.status(400)
    res.send(responseBadRequest(error))
  })
}

async function createEvent(req, res) {
  console.log('Create event')
  Event.create({
    name: req.body.name,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
    done: false,
  }).then((event) => {
    res.json(event)
    Race.create({
      name: 'Scratch',
      order: 1,
      description: req.body.description,
      EventId: event.id,
    })
    Race.create({
      name: 'Tempo race',
      order: 2,
      description: req.body.description,
      EventId: event.id,
    })
    Race.create({
      name: 'Elimination',
      order: 3,
      description: req.body.description,
      EventId: event.id,
    })
    Race.create({
      name: 'Point race',
      order: 4,
      description: req.body.description,
      EventId: event.id,
    })
    Race.create({
      name: 'Overall',
      order: 0,
      description: req.body.description,
      EventId: event.id,
    })
  }).catch((error) => {
    res.status(400)
    res.send(responseBadRequest(error))
  })
}

async function editEvent(req, res) {
  console.log('Updating event')
  const id = Number(req.params.id)
  Event.findById(id).then((event) => {
    if (event) {
      event.updateAttributes({
        name: req.body.name,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        done: req.body.done,
      }).then((updatedEvent) => {
        res.json(updatedEvent)
        res.status(200)
      }).catch((err) => {
        res.status(400)
        res.send(responseBadRequest(err))
      })
    }
  })
}

async function rankingsUpdate(req, res) {
  console.log('Update cyclist ranking in event')
  const id = Number(req.params.id)
  Event.findById(id).then((event) => {
    if (event) {
      event.updateAttributes({
        positionBefore: req.body.positionBefore,
        currentPosition: req.body.currentPosition,
        totalPoints: req.body.totalPoints,
      }).then((updatedEvent) => {
        res.json(updatedEvent)
        res.status(200)
      }).catch((err) => {
        res.status(400)
        res.send(responseBadRequest(err))
      })
    }
  })
}

async function deleteEvent(req, res) {
  console.log('Delete event')
  const id = Number(req.params.id)
  Event.destroy({ where: { id } }).then(() => {
    res.status(200)
    res.json()
  })
}

router.get('/api/events', getEventsList)
router.get('/api/events/:id', getEvent)
router.post('/api/events', createEvent)
router.put('/api/events/:id', editEvent)
router.put('/api/events/ratings/:id', rankingsUpdate)
router.delete('/api/events/:id', deleteEvent)

module.exports = {
  router,
  getEventsList,
  getEvent,
  createEvent,
  editEvent,
  rankingsUpdate,
  deleteEvent,
}
