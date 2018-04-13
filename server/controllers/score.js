

const router = require('express').Router()
const { Op } = require('sequelize').Sequelize
// const Op = Sequelize.Op

const {
  Race,
  Event,
  Cyclist,
  Score,
  Sprint,
} = require('../models/index')
const responseBadRequest = require('../helpers/responseHelper')

const TWENTY = 20

async function getScoresList(req, res) {
  console.log('Getting list of scores')
  // const eventId = Number(req.params.eventId)
  const raceId = Number(req.params.raceId)
  const eventId = Number(req.params.eventId)
  const { category } = req.body
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

async function putScoresInSpecificRace(req, res) {
  console.log('Getting score of specific race')
  const raceId = Number(req.params.raceId)
  const eventId = Number(req.params.eventId)
  console.log(req.body)
  const { category } = req.body
  const { score } = req.body
  console.log(score)
  console.log(category)
  Score.findAll({
    where: {
      CyclistId: score.CyclistId,
      raceNumber: score.raceNumber,
    },
    include: [{
      model: Race,
      where: { order: raceId, 'EventId': eventId},
    }, {
      model: Cyclist,
      as: 'Cyclist',
      where: { category, approved: 'true', uciCode: score.uciId },
    }, {
      model: Sprint, as: 'Sprints',
    }],
  }).then((foundScore) => {
    console.log(foundScore)
    if (foundScore) {
      const total = foundScore.totalPoints ? (foundScore.totalPoints + score.points) : score.points
      console.log(total)
      foundScore[0].updateAttributes({
        totalPoints: total,
      }).then((updatedScore) => {
        res.json(updatedScore)
        res.status(200)
      }).catch((error) => {
        res.status(400)
        res.send(responseBadRequest(error))
      })
    }
  })
}

async function getListOfAssigningNumbers(req, res) {
  console.log('Getting list of scores for assigning numbers')
  const eventId = Number(req.params.eventId)
  Score.findAll({
    where: {
      raceNumber: {
        [Op.eq]: 0,
      },
    },
    include: [{
      model: Race,
      where: { 'EventId': eventId },
    }, {
      model: Cyclist,
      as: 'Cyclist',
      where: {
        approved: true,
      },
    }, {
      model: Sprint, as: 'Sprints',
    }],
    order: [
      ['Cyclist', 'team', 'ASC'],
    ],
  }).then((scores) => {
    res.status(200)
    res.json(scores)
  }).catch((error) => {
    res.status(400)
    res.send(responseBadRequest(error))
  })
}

async function scoresFromAllRaces(req, res) {
  console.log('Getting list of scores from all races')
  const eventId = Number(req.params.eventId)
  const raceNumb = Number(req.params.raceNumb)
  Score.findAll({
    where: {
      raceNumber: {
        [Op.eq]: raceNumb,
      },
    },
    include: [{
      model: Race,
      where: { 'EventId': eventId },
    }, {
      model: Cyclist,
      as: 'Cyclist',
      where: {
        approved: true,
      },
    }, {
      model: Sprint, as: 'Sprints',
    }],
    order: [
      ['Race', 'order', 'ASC'],
    ],
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
    where: {
      raceNumber: {
        [Op.ne]: 0,
      },
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

async function getScoresOfRace(req, res) {
  console.log('Getting list of scores for specific race')
  const eventId = Number(req.params.eventId)
  const raceOrder = Number(req.params.raceId)
  const { cat } = req.params
  Score.findAll({
    where: {
      raceNumber: {
        [Op.ne]: 0,
      },
    },
    include: [{
      model: Race,
      where: { EventId: eventId, order: raceOrder },
    }, {
      model: Cyclist,
      as: 'Cyclist',
      where: {
        category: cat,
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

async function getScoresListOverall(req, res) {
  console.log('Getting list of scores in event men overall')
  const eventId = Number(req.params.eventId)
  const raceOrder = Number(req.params.raceOrder)
  const { cat } = req.params
  Score.findAll({
    where: {
      dns: false,
      bk: false,
      dnq: false,
      dnf: false,
      raceNumber: {
        [Op.ne]: 0,
      },
    },
    include: [{
      model: Race,
      where: {
        EventId: eventId,
        order: raceOrder,
      },
    }, {
      model: Cyclist,
      as: 'Cyclist',
      where: {
        category: cat,
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

async function getScoresWithoutNumbers(req, res) {
  console.log('Getting list of scores where race number 0')
  Score.findAll({
    where: {
      raceNumber: {
        [Op.eq]: 0,
      },
    },
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
    where: {
      raceNumber: {
        [Op.ne]: 0,
      },
    },
    include: [{
      model: Race,
      where: { EventId: eventId },
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
    positionBefore: req.body.positionBefore,
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
        positionBefore: req.body.positionBefore,
        place: req.body.place,
        totalPoints: req.body.totalPoints,
        dns: req.body.dns,
        dnq: req.body.dnq,
        dnf: req.body.dnf,
        bk: req.body.bk,
        CyclistId: req.body.CyclistId,
        // RaceId: raceId,
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
      const plus = score.lapPlusPoints + TWENTY
      const totalP = score.totalPoints
      const totalRecalc = totalP + TWENTY
      score.updateAttributes({
        lapPlusPoints: plus,
        totalPoints: totalRecalc,
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
      const minus = score.lapMinusPoints + TWENTY
      const totalP = score.totalPoints
      const totalRecalc = totalP - TWENTY
      score.updateAttributes({
        lapMinusPoints: minus,
        totalPoints: totalRecalc,
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

async function updateScoreBKorDNSorNumber(req, res) {
  console.log('Update cyclist bk and dns functionality')
  const id = Number(req.params.scoreId)
  Score.findById(id).then((score) => {
    const oldNumber = score.raceNumber
    if (score) {
      score.updateAttributes({
        raceNumber: req.body.raceNumber,
        dns: req.body.dns,
        bk: req.body.bk,
      }).then((updatedScore) => {
        Score.findAll({
          where: {
            raceNumber: oldNumber,
          },
          include: [
            {
              model: Race,
              where: {
                name: {
                  [Op.ne]: 'Overall',
                },
                EventId: req.body.eventId,
              },
            },
          ],
        }).then((scores) => {
          if (scores) {
            scores.forEach((otherScore) => {
              otherScore.updateAttributes({
                raceNumber: req.body.raceNumber,
                dns: req.body.dns,
                bk: req.body.bk,
              })
            })
          }
        })
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
  const raceOrder = Number(req.params.raceId)
  const eventId = Number(req.params.eventId)
  Score.findById(id).then((score) => {
    if (score) {
      const { dns } = score
      score.updateAttributes({
        dns: !dns,
      }).then((updatedScore) => {
        Score.findAll({
          where: {
            raceNumber: {
              [Op.eq]: updatedScore.raceNumber,
            },
          },
          include: [
            {
              model: Race,
              where: {
                order: {
                  [Op.ne]: raceOrder,
                },
                EventId: eventId,
              },
            },
          ],
        }).then((scores) => {
          if (scores) {
            scores.forEach((otherScore) => {
              const dnsOther = otherScore.dns
              otherScore.updateAttributes({
                dns: !dnsOther,
              })
            })
          }
          res.send(updatedScore)
          res.status(200)
        }).catch((err) => {
          res.status(400)
          res.send(responseBadRequest(err))
        })
      })
    }
  })
}

async function updateDnf(req, res) {
  console.log('Update cyclist DNF in score')
  const id = Number(req.params.scoreId)
  const raceOrder = Number(req.params.raceId)
  const eventId = Number(req.params.eventId)
  Score.findById(id).then((score) => {
    if (score) {
      const { dnf } = score
      score.updateAttributes({
        dnf: !dnf,
      }).then((updatedScore) => {
        Score.findAll({
          where: {
            raceNumber: {
              [Op.eq]: updatedScore.raceNumber,
            },
          },
          include: [
            {
              model: Race,
              where: {
                order: {
                  [Op.ne]: raceOrder,
                },
                EventId: eventId,
              },
            },
          ],
        }).then((scores) => {
          if (scores) {
            scores.forEach((otherScore) => {
              const dnfOther = otherScore.dnf
              otherScore.updateAttributes({
                dnf: !dnfOther,
              })
            })
          }
          res.send(updatedScore)
          res.status(200)
        }).catch((err) => {
          res.status(400)
          res.send(responseBadRequest(err))
        })
      })
    }
  })
}

async function updateDnq(req, res) {
  console.log('Update cyclist DNQ in score')
  const id = Number(req.params.scoreId)
  const raceOrder = Number(req.params.raceId)
  const eventId = Number(req.params.eventId)
  Score.findById(id).then((score) => {
    if (score) {
      const { dnq } = score
      score.updateAttributes({
        dnq: !dnq,
      }).then((updatedScore) => {
        Score.findAll({
          where: {
            raceNumber: {
              [Op.eq]: updatedScore.raceNumber,
            },
          },
          include: [
            {
              model: Race,
              where: {
                order: {
                  [Op.ne]: raceOrder,
                },
                EventId: eventId,
              },
            },
          ],
        }).then((scores) => {
          if (scores) {
            scores.forEach((otherScore) => {
              const dnqOther = otherScore.dnq
              otherScore.updateAttributes({
                dnq: !dnqOther,
              })
            })
          }
          res.send(updatedScore)
          res.status(200)
        }).catch((err) => {
          res.status(400)
          res.send(responseBadRequest(err))
        })
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

async function updateRaceNumber(req, res) {
  console.log('Update score number')
  const id = Number(req.params.scoreId)
  Score.findById(id).then((score) => {
    if (score) {
      score.updateAttributes({
        raceNumber: req.body.raceNumber,
      }).then((updatedScore) => {
        Race.findAll({
          where: {
            name: {
              [Op.ne]: 'Overall',
            },
            EventId: req.body.eventId,
          },
        }).then((races) => {
          races.forEach((race) => {
            Score.create({
              raceNumber: updatedScore.raceNumber,
              lapPlusPoints: 0,
              lapMinusPoints: 0,
              points: 0,
              finishPlace: 0,
              raceDate: '2018-09-02',
              place: 0,
              totalPoints: 0,
              dns: updatedScore.dns,
              dnq: updatedScore.dnq,
              dnf: updatedScore.dnf,
              bk: updatedScore.bk,
              RaceId: race.id,
              CyclistId: updatedScore.CyclistId,
            })
          })
        })
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
  Score.findById(id).then((score) => {
    Cyclist.findById(score.CyclistId).then((cyclist) => {
      if (cyclist) {
        cyclist.updateAttributes({
          approved: false,
        }).then(() => {
          Score.destroy({ where: { id } }).then(() => {
            res.status(200)
            res.json()
          })
        })
      }
    })
  }).catch((err) => {
    res.status(400)
    res.send(responseBadRequest(err))
  })
}

router.get('/api/events/:eventId/races/:raceId/scores', getScoresList)
router.put('/api/events/:eventId/races/:raceId/scores/specific', putScoresInSpecificRace)
router.get('/api/events/:eventId/races/scores/:raceNumb/allRaces', scoresFromAllRaces)
router.get('/api/events/:eventId/scores/men', getScoresListMen)
router.get('/api/events/:eventId/scores/women', getScoresListWomen)
router.put('/api/events/:eventId/scores/:scoreId', updateScoreBKorDNSorNumber)
router.put('/api/events/:eventId/scores/:scoreId/raceNumber', updateRaceNumber)
router.get('/api/events/:eventId/races/:raceOrder/scores/category/:cat/overall', getScoresListOverall)
router.get('/api/events/:eventId/races/:raceId/scores/category/:cat', getScoresOfRace)
router.get('/api/events/:eventId/scores', getScoresListOfEvent)
router.get('/api/scores/assignNumber', getScoresWithoutNumbers)
router.get('/api/events/:eventId/scores/assignNumber', getListOfAssigningNumbers)
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
router.delete('/api/scores/:scoreId', deleteScore)

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
  getScoresListOverall,
  updateScoreBKorDNSorNumber,
  updateRaceNumber,
  getListOfAssigningNumbers,
  getScoresWithoutNumbers,
  getScoresOfRace,
}
