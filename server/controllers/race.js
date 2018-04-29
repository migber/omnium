

const router = require('express').Router()
const { Event, Race } = require('../models/index')
const responseBadRequest = require('../helpers/responseHelper')

async function getRacesList(req, res) {
  console.log('Getting list of races')
  const id = Number(req.params.eventId)
  Race.findAll({
    include: [{
      model: Event,
      where: { id },
    }],
    order: [
      ['order', 'ASC'],
    ],
  }).then((races) => {
    res.status(200)
    res.json(races)
  }).catch((error) => {
    res.status(400)
    res.send(responseBadRequest(error))
  })
}

async function getRace(req, res) {
  console.log('Get race')
  const id = Number(req.params.eventId)
  const raceId = Number(req.params.raceId)
  Race.findOne({
    where: {
      order: raceId,
    },
    include: [{
      model: Event,
      where: { id },
    }],
    order: [
      ['order', 'ASC'],
    ],
  }).then((races) => {
    res.status(200)
    res.json(races)
  }).catch((error) => {
    res.status(400)
    res.send(responseBadRequest(error))
  })
}

async function createRace(req, res) {
  console.log('Create race')
  const id = Number(req.params.eventId)
  const { races } = req.body
  races.forEach((race) => {
    Race.create({
      name: race.name,
      description: race.description,
      order: race.order,
      EventId: id,
    }).then((createdRace) => {
      res.send(createdRace)
    }).catch((error) => {
      res.status(400)
      res.send(responseBadRequest(error))
    })
  })
}

async function editRace(req, res) {
  console.log('Updating Race')
  const id = Number(req.params.raceId)
  Race.findById(id).then((race) => {
    if (race) {
      race.updateAttributes({
        name: req.body.name,
        elapseTime: req.body.elapseTime,
        avgSpeed: req.body.avgSpeed,
        order: req.body.order,
        description: req.body.description,
        communique: req.body.communique,
      }).then((updatedRace) => {
        res.json(updatedRace)
        res.status(200)
      }).catch((err) => {
        res.status(400)
        res.send(responseBadRequest(err))
      })
    }
  })
}

async function updateMetrics(req, res) {
  console.log('Updating race metrics')
  const id = Number(req.params.raceId)
  Race.findById(id).then((race) => {
    if (race) {
      race.updateAttributes({
        elapseTime: req.body.elapseTime,
        avgSpeed: req.body.avgSpeed,
      }).then((updatedRace) => {
        res.json(updatedRace)
        res.status(200)
      }).catch((err) => {
        res.status(400)
        res.send(responseBadRequest(err))
      })
    }
  })
}

async function editElapsedTime(req, res) {
  console.log('Updating race metrics - elapsed time')
  const id = Number(req.params.raceId)
  Race.findById(id).then((race) => {
    if (race) {
      race.updateAttributes({
        elapseTime: req.body.elapseTime,
      }).then((updatedRace) => {
        res.json(updatedRace)
        res.status(200)
      }).catch((err) => {
        res.status(400)
        res.send(responseBadRequest(err))
      })
    }
  })
}

async function editAvgSpeed(req, res) {
  console.log('Updating race metrics - avg speed')
  const id = Number(req.params.raceId)
  Race.findById(id).then((race) => {
    if (race) {
      race.updateAttributes({
        avgSpeed: req.body.avgSpeed,
      }).then((updatedRace) => {
        res.json(updatedRace)
        res.status(200)
      }).catch((err) => {
        res.status(400)
        res.send(responseBadRequest(err))
      })
    }
  })
}

async function editCommunique(req, res) {
  console.log('Updating race metrics - commuqiue')
  const id = Number(req.params.raceId)
  Race.findById(id).then((race) => {
    if (race) {
      race.updateAttributes({
        communique: req.body.communique,
      }).then((updatedRace) => {
        res.json(updatedRace)
        res.status(200)
      }).catch((err) => {
        res.status(400)
        res.send(responseBadRequest(err))
      })
    }
  })
}

async function deleteRace(req, res) {
  console.log('Delete race')
  const id = Number(req.params.raceId)
  Race.destroy({ where: { id } }).then(() => {
    res.status(200)
    res.json()
  })
}

router.get('/api/events/:eventId/races', getRacesList)
router.get('/api/events/:eventId/races/:raceId', getRace)
router.post('/api/events/:eventId/races', createRace)
router.put('/api/events/:eventId/races/:raceId', editRace)
router.put('/api/events/:eventId/races/:raceId/avgSpeed', editAvgSpeed)
router.put('/api/events/:eventId/races/:raceId/elapsedTime', editElapsedTime)
router.put('/api/events/:eventId/races/:raceId/communique', editCommunique)
router.put('/api/events/:eventId/races/:raceId/metrics', updateMetrics)
router.delete('/api/events/:eventId/races/:raceId', deleteRace)

module.exports = {
  router,
  getRacesList,
  getRace,
  createRace,
  editRace,
  updateMetrics,
  editAvgSpeed,
  editElapsedTime,
  editCommunique,
  deleteRace,
}
