

const router = require('express').Router()
const {
  Race,
  Event,
  Cyclist,
  Score,
  Sprint,
} = require('../models/index')
const responseBadRequest = require('../helpers/responseHelper')

async function getScoresList(req, res) {
  console.log('Getting list of scores')
  // const eventId = Number(req.params.eventId)
  const raceId = Number(req.params.raceId)
  const eventId = Number(req.params.eventId)
  const category = req.body.category

  Score.findAll({
    include: [{
      model: Race,
      where: { order: raceId, 'EventId': eventId },
    }, {
      model: Cyclist,
      as: 'Cyclist',
      where: { category, approved: 'true' },
    }, {
      model: Sprint, as: 'Sprints',
    }],
  }).then((scores) => {
    res.status(200)
    res.json(scores)
  }).catch((error) => {
    res.status(400)
    res.send(responseBadRequest(error))
  })
}

async function getScoresListOfEvent(req, res) {
  console.log('Getting list of scores in event')
  // const eventId = Number(req.params.eventId)
  const eventId = Number(req.params.eventId)
  Score.findAll({
    order: [
      ['totalPoints', 'DESC'],
    ],
    include: [{
      model: Race,
      where: { 'EventId': eventId },
    }, {
      model: Cyclist,
      as: 'Cyclist',
      where: { approved: true },
    }, {
      model: Sprint, as: 'Sprints',
    }],
  }).then((scores) => {
    res.status(200)
    res.json(scores)
  }).catch((error) => {
    res.status(400)
    res.send(responseBadRequest(error))
  })
}

async function getScoresListWomen(req, res) {
  console.log('Getting list of scores in event women')
  const eventId = Number(req.params.eventId)
  Score.findAll({
    include: [{
      model: Race,
      where: { 'EventId': eventId },
    }, {
      model: Cyclist,
      as: 'Cyclist',
      where: {
        category: 'women',
        approved: true,
      },
    }, {
      model: Sprint, as: 'Sprints',
    }],
  }).then((scores) => {
    res.status(200)
    res.json(scores)
  }).catch((error) => {
    res.status(400)
    res.send(responseBadRequest(error))
  })
}

async function getScoresListWomenOverall(req, res) {
  console.log('Getting list of scores in event women')
  const eventId = Number(req.params.eventId)
  Score.findAll({
    where: {
      dns: false,
      bk: false,
      dnq: false,
      dnf: false,
    },
    include: [{
      model: Race,
      where: { 'EventId': eventId },
    }, {
      model: Cyclist,
      as: 'Cyclist',
      where: {
        category: 'women',
        approved: true,
      },
    }, {
      model: Sprint, as: 'Sprints',
    }],
  }).then((scores) => {
    res.status(200)
    res.json(scores)
  }).catch((error) => {
    res.status(400)
    res.send(responseBadRequest(error))
  })
}

async function getScoresListMenOverall(req, res) {
  console.log('Getting list of scores in event men overall')
  const eventId = Number(req.params.eventId)
  Score.findAll({
    where: {
      dns: false,
      bk: false,
      dnq: false,
      dnf: false,
    },
    include: [{
      model: Race,
      where: { 'EventId': eventId },
    }, {
      model: Cyclist,
      as: 'Cyclist',
      where: {
        category: 'men',
        approved: true,
      },
    }, {
      model: Sprint, as: 'Sprints',
    }],
  }).then((scores) => {
    res.status(200)
    res.json(scores)
  }).catch((error) => {
    res.status(400)
    res.send(responseBadRequest(error))
  })
}

async function getScoresListMen(req, res) {
  console.log('Getting list of scores in event men')
  const eventId = Number(req.params.eventId)
  Score.findAll({
    include: [{
      model: Race,
      where: { 'EventId': eventId },
    }, {
      model: Cyclist,
      as: 'Cyclist',
      where: {
        category: 'men',
        approved: true,
      },
    }, {
      model: Sprint, as: 'Sprints',
    }],
  }).then((scores) => {
    res.status(200)
    res.json(scores)
  }).catch((error) => {
    res.status(400)
    res.send(responseBadRequest(error))
  })
}

async function getScore(req, res) {
  console.log('Get score')
  const scoreId = Number(req.params.scoreId)
  Score.findById(scoreId).then((score) => {
    res.json(score)
  }).catch((error) => {
    res.status(400)
    res.send(responseBadRequest(error))
  })
}

async function createScore(req, res) {
  console.log('Create score')
  const raceOrder = Number(req.params.raceId)
  Score.create({
    raceNumber: req.body.raceNumber,
    lapPlusPoints: req.body.lapPlusPoints,
    lapMinusPoints: req.body.lapMinusPoints,
    points: req.body.points,
    finishPlace: req.body.finishPlace,
    raceDate: req.body.raceDate,
    place: req.body.place,
    totalPoints: req.body.totalPoints,
    dns: false,
    dnq: false,
    dnf: false,
    bk: req.body.bk,
    RaceId: req.body.RaceId,
    CyclistId: req.body.CyclistId,
  }).then((score) => {
    res.json(score)
  }).catch((error) => {
    res.status(400)
    res.send(responseBadRequest(error))
  })
}

async function editScore(req, res) {
  console.log('Updating score')
  const raceId = Number(req.params.raceId)
  const id = Number(req.params.scoreId)
  Score.findById(id).then((score) => {
    if (score) {
      score.updateAttributes({
        raceNumber: req.body.raceNumber,
        lapPlusPoints: req.body.lapPlusPoints,
        lapMinusPoints: req.body.lapMinusPoints,
        points: req.body.points,
        finishPlace: req.body.finishPlace,
        raceDate: req.body.raceDate,
        place: req.body.place,
        totalPoints: req.body.totalPoints,
        dns: req.body.dns,
        dnq: req.body.dnq,
        dnf: req.body.dnf,
        bk: req.body.bk,
        CyclistId: req.body.CyclistId,
        RaceId: raceId,
      }).then((updatedScore) => {
        res.json(updatedScore)
        res.status(200)
      }).catch((err) => {
        res.status(400)
        res.send(responseBadRequest(err))
      })
    }
  })
}

async function updateLapPliusPoints(req, res) {
  console.log('Update cyclist plus laps in score')
  const id = Number(req.params.scoreId)
  Score.findById(id).then((score) => {
    if (score) {
      score.updateAttributes({
        lapPlusPoints: req.body.lapPlusPoints,
      }).then((updatedScore) => {
        res.json(updatedScore)
        res.status(200)
      }).catch((err) => {
        res.status(400)
        res.send(responseBadRequest(err))
      })
    }
  })
}

async function updateLapMinusPoints(req, res) {
  console.log('Update cyclist minus laps in score')
  const id = Number(req.params.scoreId)
  Score.findById(id).then((score) => {
    if (score) {
      score.updateAttributes({
        lapMinusPoints: req.body.lapMinusPoints,
      }).then((updatedScore) => {
        res.json(updatedScore)
        res.status(200)
      }).catch((err) => {
        res.status(400)
        res.send(responseBadRequest(err))
      })
    }
  })
}

async function updatePoints(req, res) {
  console.log('Update cyclist points in score')
  const id = Number(req.params.scoreId)
  Score.findById(id).then((score) => {
    if (score) {
      score.updateAttributes({
        points: req.body.points,
      }).then((updatedScore) => {
        res.json(updatedScore)
        res.status(200)
      }).catch((err) => {
        res.status(400)
        res.send(responseBadRequest(err))
      })
    }
  })
}

async function updateFinishPlace(req, res) {
  console.log('Update cyclist finish place in score')
  const id = Number(req.params.scoreId)
  Score.findById(id).then((score) => {
    if (score) {
      score.updateAttributes({
        finishPlace: req.body.finishPlace,
      }).then((updatedScore) => {
        res.json(updatedScore)
        res.status(200)
      }).catch((err) => {
        res.status(400)
        res.send(responseBadRequest(err))
      })
    }
  })
}

async function updatePlace(req, res) {
  console.log('Update cyclist place in score')
  const id = Number(req.params.scoreId)
  Score.findById(id).then((score) => {
    if (score) {
      score.updateAttributes({
        place: req.body.place,
      }).then((updatedScore) => {
        res.json(updatedScore)
        res.status(200)
      }).catch((err) => {
        res.status(400)
        res.send(responseBadRequest(err))
      })
    }
  })
}

async function updateTotalPoints(req, res) {
  console.log('Update cyclist total points in score')
  const id = Number(req.params.scoreId)
  Score.findById(id).then((score) => {
    if (score) {
      score.updateAttributes({
        totalPoints: req.body.totalPoints,
      }).then((updatedScore) => {
        res.json(updatedScore)
        res.status(200)
      }).catch((err) => {
        res.status(400)
        res.send(responseBadRequest(err))
      })
    }
  })
}

async function updateDns(req, res) {
  console.log('Update cyclist DNS in score')
  const id = Number(req.params.scoreId)
  Score.findById(id).then((score) => {
    if (score) {
      score.updateAttributes({
        dns: req.body.dns,
      }).then((updatedScore) => {
        res.json(updatedScore)
        res.status(200)
      }).catch((err) => {
        res.status(400)
        res.send(responseBadRequest(err))
      })
    }
  })
}

async function updateDnf(req, res) {
  console.log('Update cyclist DNF in score')
  const id = Number(req.params.scoreId)
  Score.findById(id).then((score) => {
    if (score) {
      score.updateAttributes({
        dnf: req.body.dnf,
      }).then((updatedScore) => {
        res.json(updatedScore)
        res.status(200)
      }).catch((err) => {
        res.status(400)
        res.send(responseBadRequest(err))
      })
    }
  })
}

async function updateDnq(req, res) {
  console.log('Update cyclist DNQ in score')
  const id = Number(req.params.scoreId)
  Score.findById(id).then((score) => {
    if (score) {
      score.updateAttributes({
        dnq: req.body.dnq,
      }).then((updatedScore) => {
        res.json(updatedScore)
        res.status(200)
      }).catch((err) => {
        res.status(400)
        res.send(responseBadRequest(err))
      })
    }
  })
}

async function updateBk(req, res) {
  console.log('Update cyclist BK in score')
  const id = Number(req.params.scoreId)
  Score.findById(id).then((score) => {
    if (score) {
      score.updateAttributes({
        bk: req.body.bk,
      }).then((updatedScore) => {
        res.json(updatedScore)
        res.status(200)
      }).catch((err) => {
        res.status(400)
        res.send(responseBadRequest(err))
      })
    }
  })
}

async function deleteScore(req, res) {
  console.log('Delete score')
  const id = Number(req.params.scoreId)
  Score.destroy({ where: { id } }).then(() => {
    res.status(200)
    res.json()
  })
}

router.get('/api/events/:eventId/races/:raceId/scores', getScoresList)
router.get('/api/events/:eventId/scores/men', getScoresListMen)
router.get('/api/events/:eventId/scores/women', getScoresListWomen)
router.get('/api/events/:eventId/scores/women/overall', getScoresListWomenOverall)
router.get('/api/events/:eventId/scores/men/overall', getScoresListMenOverall)
router.get('/api/events/:eventId/scores', getScoresListOfEvent)
router.get('/api/events/:eventId/races/:raceId/scores/:scoreId', getScore)
router.post('/api/events/:eventId/races/:raceId/scores', createScore)
router.put('/api/events/:eventId/races/:raceId/scores/:scoreId', editScore)
router.put('/api/events/:eventId/races/:raceId/scores/:scoreId/lapPliusPoints', updateLapPliusPoints)
router.put('/api/events/:eventId/races/:raceId/scores/:scoreId/lapMinusPoints', updateLapMinusPoints)
router.put('/api/events/:eventId/races/:raceId/scores/:scoreId/points', updatePoints)
router.put('/api/events/:eventId/races/:raceId/scores/:scoreId/finishPlace', updateFinishPlace)
router.put('/api/events/:eventId/races/:raceId/scores/:scoreId/place', updatePlace)
router.put('/api/events/:eventId/races/:raceId/scores/:scoreId/totalPoints', updateTotalPoints)
router.put('/api/events/:eventId/races/:raceId/scores/:scoreId/dns', updateDns)
router.put('/api/events/:eventId/races/:raceId/scores/:scoreId/dnf', updateDnf)
router.put('/api/events/:eventId/races/:raceId/scores/:scoreId/dnq', updateDnq)
router.put('/api/events/:eventId/races/:raceId/scores/:scoreId/bk', updateBk)
router.delete('/api/events/:eventId/races/:raceId/scores', deleteScore)

module.exports = {
  router,
  getScoresList,
  getScore,
  createScore,
  editScore,
  updateLapPliusPoints,
  updateLapMinusPoints,
  updatePoints,
  updateFinishPlace,
  updatePlace,
  updateTotalPoints,
  updateDns,
  updateDnf,
  updateDnq,
  updateBk,
  deleteScore,
  getScoresListOfEvent,
  getScoresListWomen,
  getScoresListMen,
  getScoresListWomenOverall,
  getScoresListMenOverall,
}
