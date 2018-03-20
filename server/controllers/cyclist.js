'use strict'

const router = require('express').Router()
const { Cyclist, Race } = require('../models/index')
const responseBadRequest = require('../helpers/responseHelper')
const Excel = require('exceljs')

// const passport = require('passport')
// const { Strategy } = require('passport-http-bearer')

async function getCyclistsList(req, res) {
  console.log('Getting list of cyclists')
  Cyclist.findAll({}).then((cyclist) => {
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
  console.log(req.body)
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
        approved: false,
      }).then((updatedCyclist) => {
        res.json(updatedCyclist)
        res.status(200)
      }).catch((err) => {
        res.status(400)
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
async function fileUpload(req, res) {
  console.log('File upload')
  if (req.files.file) {
    res.send('File was uploaded')
    res.status(200)
    const workbook = new Excel.Workbook()
    workbook.xlsx.readFile(req.files.file.path.toString('utf8'))
      .then(() => {
        const worksheet = workbook.getWorksheet('registration')
        worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
          console.log(`Row  ${rowNumber} = ${JSON.stringify(row.values)}`)
        })
      })
  } else {
    res.send(responseBadRequest('file was not uploaded'))
  }
}

router.get('/api/cyclists', getCyclistsList)
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
}
