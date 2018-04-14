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

async function createSprintOnly(req, res) {
  console.log('Create sprint')
  const scoreId = Number(req.params.scoreId)
  Sprint.create({
    sprintNumber: req.body.sprintNumber,
    sprintPoints: req.body.sprintPoints,
    ScoreId: scoreId,
  }).then((sprint) => {
    Score.findById(scoreId).then((score) => {
      const total = score.totalPoints + 1
      score.updateAttributes({
        totalPoints: total,
      }).then(() => {
        res.json(sprint)
      })
    })
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
      Score.findById(scoreId).then((score) => {
        const total = score.totalPoints - 1
        score.updateAttributes({
          totalPoints: total,
        }).then(() => {
          Sprint.destroy({ where: { id: sprintDelete.id } }).then(() => {
            res.json('deleted')
            res.status(200)
          })
        })
      })
    } else {
      Sprint.create({
        sprintNumber: req.body.sprintNumber,
        sprintPoints: req.body.sprintPoints,
        ScoreId: scoreId,
      }).then((sprint) => {
        Score.findById(scoreId).then((score) => {
          const total = score.totalPoints + 1
          score.updateAttributes({
            totalPoints: total,
          }).then(() => {
            res.json(sprint)
          })
        })
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
  const scoreId = Number(req.params.scoreId)
  Sprint.findById(id).then((sprint) => {
    if (sprint) {
      Score.findById(scoreId).then((score) => {
        const total = score.totalPoints
        console.log(total)
        const { sprintPoints } = sprint
        console.log(sprintPoints)
        const minus = total - sprintPoints
        console.log(minus)
        const plus = total + req.body.sprintPoints
        console.log(plus)
        console.log(sprintPoints)
        if (sprintPoints !== 0) {
          sprint.updateAttributes({
            sprintNumber: req.body.sprintNumber,
            sprintPoints: 0,
          }).then(() => {
            score.updateAttributes({
              totalPoints: minus,
            }).then((scoreUp) => {
              res.json(scoreUp)
              res.status(200)
            })
          }).catch((err) => {
            res.status(400)
            res.send(responseBadRequest(err))
          })
        } else {
          sprint.updateAttributes({
            sprintNumber: req.body.sprintNumber,
            sprintPoints: req.body.sprintPoints,
          }).then(() => {
            score.updateAttributes({
              totalPoints: plus,
            }).then((scoreUp) => {
              res.json(scoreUp)
              res.status(200)
            })
          }).catch((err) => {
            res.status(400)
            res.send(responseBadRequest(err))
          })
        }
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
router.post('/api/events/:eventId/races/:raceId/scores/:scoreId/sprints/only', createSprintOnly)
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
