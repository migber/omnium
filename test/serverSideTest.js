'use strict'

const cyclistController = require('../server/controllers/cyclist')
const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../server/index')
const should = chai.should()

chai.use(chaiHttp)

/*
  * Test the /GET route
  */
describe('/GET cyclists', () => {
  it('it should GET all the cyclists', (done) => {
    chai.request(server)
      .get('/api/cyclists')
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.be.a('array')
        res.body.length.should.be.eql(35)
        done()
      })
  })

  it('it should GET all approved the cyclists', (done) => {
    chai.request(server)
      .get('/api/cyclists/approved')
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.be.a('array')
        res.body.length.should.be.eql(35)
        done()
      })
  })

  it('it should GET all not approved the cyclists', (done) => {
    chai.request(server)
      .get('/api/cyclists/notApproved')
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.be.a('array')
        res.body.length.should.be.eql(0)
        done()
      })
  })

  it('it should GET one cyclist', (done) => {
    chai.request(server)
      .get('/api/cyclists/74')
      .end((err, res) => {
        res.should.have.status(200)
        done()
      })
  })
})

describe('/GET events', () => {
  it('it should GET all the events', (done) => {
    chai.request(server)
      .get('/api/events')
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.be.a('array')
        res.body.length.should.be.eql(1)
        done()
      })
  })
})

describe('/GET races', () => {
  it('it should GET all races', (done) => {
    chai.request(server)
      .get('/api/events/10/races')
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.be.a('array')
        res.body.length.should.be.eql(5)
        done()
      })
  })
  it('it should GET the race', (done) => {
    chai.request(server)
      .get('/api/events/10/races/17')
      .end((err, res) => {
        res.should.have.status(200)
        done()
      })
  })
})

describe('/GET scores', () => {
  it('it should GET all scores', (done) => {
    chai.request(server)
      .get('/api/events/10/races/1/scores')
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.be.a('array')
        res.body.length.should.be.eql(0)
        done()
      })
  })

  it('it should GET the scores list of men', (done) => {
    chai.request(server)
      .get('/api/events/10/scores/men')
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.be.a('array')
        res.body.length.should.be.eql(10)
        done()
      })
  })

  it('it should GET the scores list of women', (done) => {
    chai.request(server)
      .get('/api/events/10/scores/women')
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.be.a('array')
        res.body.length.should.be.eql(5)
        done()
      })
  })

  it('it should GET the scores list of women overall', (done) => {
    chai.request(server)
      .get('/api/events/10/races/1/scores/category/women/overall')
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.be.a('array')
        res.body.length.should.be.eql(1)
        done()
      })
  })

  it('it should GET the scores list of women', (done) => {
    chai.request(server)
      .get('/api/events/10/races/1/scores/category/women')
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.be.a('array')
        res.body.length.should.be.eql(1)
        done()
      })
  })

  it('it should GET the scores list of women dnx', (done) => {
    chai.request(server)
      .get('/api/events/10/races/1/scores/category/women/dnx')
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.be.a('array')
        res.body.length.should.be.eql(1)
        done()
      })
  })

  it('it should GET the scores list in event', (done) => {
    chai.request(server)
      .get('/api/events/10/scores')
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.be.a('array')
        res.body.length.should.be.eql(15)
        done()
      })
  })

  it('it should GET the scores with need to be numbers assigned', (done) => {
    chai.request(server)
      .get('/api/scores/assignNumber')
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.be.a('array')
        res.body.length.should.be.eql(0)
        done()
      })
  })

  it('it should GET the scores with need to be numbers assigned in the event', (done) => {
    chai.request(server)
      .get('/api/events/10/scores/assignNumber')
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.be.a('array')
        res.body.length.should.be.eql(0)
        done()
      })
  })

  it('it should GET the score', (done) => {
    chai.request(server)
      .get('/api/events/10/races/0/scores/410')
      .end((err, res) => {
        res.should.have.status(200)
        done()
      })
  })
})

describe('/GET sprints', () => {
  it('it should GET all sprints', (done) => {
    chai.request(server)
      .get('/api/events/10/races/4/scores/416/sprints')
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.be.a('array')
        res.body.length.should.be.eql(28)
        done()
      })
  })

  it('it should GET the sprint of specific score', (done) => {
    chai.request(server)
      .get('/api/events/10/races/4/scores/416/sprints/686')
      .end((err, res) => {
        res.should.have.status(200)
        done()
      })
  })
})

describe('/GET user', () => {
  it('it should GET all users', (done) => {
    chai.request(server)
      .get('/api/users')
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.be.a('array')
        res.body.length.should.be.eql(3)
        done()
      })
  })

  it('it should GET all users which are not approved', (done) => {
    chai.request(server)
      .get('/api/users/notApproved')
      .end((err, res) => {
        res.should.have.status(200)
        done()
      })
  })
  it('it should GET user', (done) => {
    chai.request(server)
      .get('/api/users/29')
      .end((err, res) => {
        res.should.have.status(200)
        done()
      })
  })
})