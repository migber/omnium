

const router = require('express').Router()
const { Cyclist, Race, Score } = require('../models/index')
const responseBadRequest = require('../helpers/responseHelper')
const Excel = require('exceljs')
const { Op } = require('sequelize').Sequelize


async function getCyclistsList(req, res) {
  console.log('Getting list of cyclists')
  Cyclist.findAll({}).then((cyclist) => {
    res.json(cyclist)
  }).catch((error) => {
    res.status(400)
    res.send(responseBadRequest(error))
  })
}

async function getCyclistsListNotApproved(req, res) {
  console.log('Getting list of cyclists not approved')
  Cyclist.findAll({
    where: {
      approved: false,
    },
    order: [['team', 'ASC'], ['createdAt', 'DESC']],
  }).then((cyclist) => {
    res.json(cyclist)
  }).catch((error) => {
    res.status(400)
    res.send(responseBadRequest(error))
  })
}

async function getCyclistsListApproved(req, res) {
  console.log('Getting list of cyclists approved')
  Cyclist.findAll({
    where: {
      approved: true,
    },
  }).then((cyclist) => {
    res.json(cyclist)
  }).catch((error) => {
    res.status(400)
    res.send(responseBadRequest(error))
  })
}

async function getCyclist(req, res) {
  console.log('Get cyclist')
  const id = Number(req.params.cyclistId)
  Cyclist.findById(id).then((cyclist) => {
    res.json(cyclist)
  }).catch((error) => {
    res.status(400)
    res.send(responseBadRequest(error))
  })
}

async function createCyclist(req, res) {
  console.log('Create cyclist')
  Cyclist.create({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    uciCode: req.body.uciCode,
    team: req.body.team,
    nationality: req.body.nationality,
    birthdate: req.body.birthdate,
    gender: req.body.gender,
    category: req.body.category,
    approved: false,
  }).then((cyclist) => {
    res.json(cyclist)
  }).catch((error) => {
    res.status(400)
    res.send(responseBadRequest(error))
  })
}

async function editCyclist(req, res) {
  console.log('Updating Cyclist')
  const id = Number(req.params.cyclistId)
  Cyclist.findById(id).then((cyclist) => {
    if (cyclist) {
      cyclist.updateAttributes({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        uciCode: req.body.uciCode,
        team: req.body.team,
        nationality: req.body.nationality,
        birthdate: req.body.birthdate,
        gender: req.body.gender,
        category: req.body.category,
        approved: req.body.approved,
      }).then((updatedCyclist) => {
        res.json(updatedCyclist)
        res.status(200)
      }).catch((err) => {
        res.status(400)
        console.log(err)
        res.send(responseBadRequest(err))
      })
    }
  })
}

async function approveCyclist(req, res) {
  console.log('Approving Cyclist')
  const id = Number(req.params.cyclistId)
  Cyclist.findById(id).then((cyclist) => {
    if (cyclist) {
      cyclist.updateAttributes({
        approved: req.body.approved,
      }).then((updatedCyclist) => {
        Race.findOne({
          where: {
            order: {
              [Op.eq]: 0,
            },
            EventId: req.body.eventId,
          },
        }).then((race) => {
          Score.create({
            raceNumber: 0,
            lapPlusPoints: 0,
            lapMinusPoints: 0,
            points: 0,
            finishPlace: 0,
            raceDate: '2018-09-03',
            place: 0,
            totalPoints: 0,
            dns: false,
            dnq: false,
            dnf: false,
            bk: false,
            RaceId: race.id,
            CyclistId: updatedCyclist.id,
          })
        })
        res.json(updatedCyclist)
        res.status(200)
      }).catch((err) => {
        res.status(400)
        res.send(responseBadRequest(err))
      })
    }
  })
}

async function deleteCyclist(req, res) {
  console.log('Delete cyclist')
  const id = Number(req.params.cyclistId)
  Cyclist.destroy({ where: { id } }).then(() => {
    res.status(200)
    res.json()
  })
}

async function getScoreCyclists(req, res) {
  console.log('Getting list of cyclists')
  // const eventId = Number(req.params.eventId)
  const raceId = Number(req.params.raceId)
  Cyclist.findAll({
    include: [{
      model: Race,
      where: { id: raceId },
    }],
  }).then((cyclists) => {
    res.json(cyclists)
    res.status(200)
  }).catch((err) => {
    res.status(400)
    res.send(responseBadRequest(err))
  })
}

async function listOfCyclisttoApprove(req, res) {
  console.log('Getting list of cyclists to approve')
  Cyclist.findAll({
    where: {
      approve: false,
    },
  }).then((cyclists) => {
    res.json(cyclists)
    res.status(200)
  }).catch((err) => {
    res.status(400)
    res.send(responseBadRequest(err))
  })
}

async function createCyclistsFromRegistration(cyclists) {
  if (cyclists) {
    cyclists.forEach(async (cyclist) => {
      const found = await Cyclist.findAll({
        where: {
          firstName: cyclist.firstName,
          lastName: cyclist.lastName,
          uciCode: cyclist.uciCode.toString(),
        },
      }).then()
      if (found.length === 0) {
        Cyclist.create({
          firstName: cyclist.firstName,
          lastName: cyclist.lastName,
          uciCode: cyclist.uciCode,
          team: cyclist.team,
          nationality: cyclist.nationality,
          birthdate: cyclist.birthdate,
          gender: cyclist.gender,
          category: cyclist.category,
          approved: false,
        }).then(() => {
          console.log('Cyclist was created')
        }).catch((error) => {
          console.log(`Something went wrong ${error}`)
        })
      }
    })
  }
}

async function fileUpload(req, res) {
  console.log('File upload')
  console.log(req.files.file.path)
  if (req.files.file) {
    const cyclists = []
    res.send('File was uploaded')
    res.status(200)
    const workbook = new Excel.Workbook()
    workbook.xlsx.readFile(req.files.file.path.toString('utf8'))
      .then(() => {
        const worksheet = workbook.getWorksheet('registration')
        worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
          if (rowNumber !== 1) {
            const cyclist = {
              firstName: row.values[2],
              lastName: row.values[3].toUpperCase(),
              uciCode: row.values[4],
              team: row.values[5],
              nationality: row.values[6].toUpperCase(),
              birthdate: Date(row.values[7]),
              gender: row.values[8],
              category: row.values[9].toLowerCase(),
              approved: false,
            }
            cyclists.push(cyclist)
          }
        })
        createCyclistsFromRegistration(cyclists)
      })
  } else {
    res.send(responseBadRequest('file was not uploaded'))
  }
}

router.get('/api/cyclists', getCyclistsList)
router.get('/api/cyclists/approved', getCyclistsListApproved)
router.get('/api/cyclists/notApproved', getCyclistsListNotApproved)
router.get('/api/cyclists/:cyclistId', getCyclist)
router.post('/api/cyclists', createCyclist)
router.put('/api/cyclists/:cyclistId', editCyclist)
router.get('/api/events/:eventId/races/:raceId/cyclists', getScoreCyclists)
router.get('/api/cyclists/approve', listOfCyclisttoApprove)
router.put('/api/cyclists/approve/:cyclistId', approveCyclist)
router.delete('/api/cyclists/:cyclistId', deleteCyclist)
router.post('/api/uploadFile', fileUpload)

module.exports = {
  router,
  getCyclistsList,
  getCyclist,
  createCyclist,
  editCyclist,
  deleteCyclist,
  approveCyclist,
  getScoreCyclists,
  listOfCyclisttoApprove,
  fileUpload,
  getCyclistsListNotApproved,
  getCyclistsListApproved,
}
