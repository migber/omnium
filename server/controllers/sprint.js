'use strict'

const router = require('express').Router()
const { Sprint, Score } = require('../models/index')
const responseBadRequest = require('../helpers/responseHelper')
const { Op } = require('sequelize').Sequelize

async function getSprintsList(req, res) {
  console.log('Getting list of sprints')
  Sprint.findAll({
    include: [{
      model: Score,
    }],
  }).then((sprints) => {
    res.json(sprints)
  }).catch((error) => {
    res.status(400)
    res.send(responseBadRequest(error))
  })
}

async function getSprint(req, res) {
  console.log('Get sprint')
  const sprintId = Number(req.params.sprintId)
  Sprint.findById(sprintId).then((sprint) => {
    res.json(sprint)
  }).catch((error) => {
    res.status(400)
    res.send(responseBadRequest(error))
  })
}

async function createSprint(req, res) {
  console.log('Create sprint')
  const scoreId = Number(req.params.scoreId)
  Sprint.findAll({
    where: {
      ScoreId: {
        [Op.eq]: scoreId,
      },
      sprintNumber: {
        [Op.eq]: req.body.sprintNumber,
      },
    },
  }).then((sprints) => {
    console.log(sprints)
    if (sprints.length !== 0) {
      const sprintDelete = sprints[0]
      Sprint.destroy({ where: { id: sprintDelete.id } }).then(() => {
      })
    } else {
      Sprint.create({
        sprintNumber: req.body.sprintNumber,
        sprintPoints: req.body.sprintPoints,
        ScoreId: scoreId,
      }).then((sprint) => {
        res.json(sprint)
      }).catch((error) => {
        res.status(400)
        res.send(responseBadRequest(error))
      })
    }
  })
}

async function editSprint(req, res) {
  console.log('Updating sprint')
  const id = Number(req.params.sprintId)
  Sprint.findById(id).then((sprint) => {
    if (sprint) {
      sprint.updateAttributes({
        sprintNumber: req.body.sprintNumber,
        sprintPoints: req.body.sprintPoints,
      }).then((updatedSprint) => {
        res.json(updatedSprint)
        res.status(200)
      }).catch((err) => {
        res.status(400)
        res.send(responseBadRequest(err))
      })
    }
  })
}

async function deleteSprint(req, res) {
  console.log('Delete sprint')
  const id = Number(req.params.sprintId)
  Sprint.destroy({ where: { id } }).then(() => {
    res.status(200)
    res.json()
  })
}

router.get('/api/events/:eventId/races/:raceId/scores/:scoreId/sprints', getSprintsList)
router.get('/api/events/:eventId/races/:raceId/scores/:scoreId/sprints/:sprintId', getSprint)
router.post('/api/events/:eventId/races/:raceId/scores/:scoreId/sprints', createSprint)
router.put('/api/events/:eventId/races/:raceId/scores/:scoreId/sprints/:sprintId', editSprint)
router.delete('/api/events/:eventId/races/:raceId/scores/:scoreId/sprints/:sprintId', deleteSprint)

module.exports = {
  router,
  getSprintsList,
  getSprint,
  createSprint,
  editSprint,
  deleteSprint,
}
