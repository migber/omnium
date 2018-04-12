'use strict'

const Sequelize = require('sequelize')

function Connection() {
  const sequelize = new Sequelize(process.env.DATABASE, process.env.DB_USER, process.env.PASS, {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    dialectOptions: {
      ssl: true,
    },
    operatorsAliases: false,
  })
  const Cyclist = sequelize.define('cyclist', {
    hashValue: {
      type: Sequelize.STRING,
    },
    raceNumber: {
      type: Sequelize.INTEGER,
    },
    firstName: {
      type: Sequelize.STRING,
    },
    lastName: {
      type: Sequelize.STRING,
    },
    uciCode: {
      type: Sequelize.INTEGER,
    },
    team: {
      type: Sequelize.STRING,
    },
    nationality: {
      type: Sequelize.STRING,
    },
    birthddate: {
      type: Sequelize.DATE,
    },
    gender: {
      type: Sequelize.STRING,
    },
    category: {
      type: Sequelize.STRING,
    },
  })

  const Race = sequelize.define('race', {
    elapsetime: {
      type: Sequelize.STRING,
    },
    name: {
      type: Sequelize.ENUM,
      values: ['scratch', 'elimination', 'tempo', 'pointRace']
    },
    avgSpeed: {
      type: Sequelize.DECIMAL,
    },
    description: {
      type: Sequelize.STRING,
    },
    score: {
      type: Sequelize.INTEGER,
    },
  })

  const Score = sequelize.define('score', {
    raceNumber: {
      type: Sequelize.INTEGER,
    },
    lapPlusPoints: {
      type: Sequelize.INTEGER,
    },
    lapMinusPoints: {
      type: Sequelize.INTEGER,
    },
    points: {
      type: Sequelize.INTEGER,
    },
    finishPlace: {
      type: Sequelize.INTEGER,
    },
    raceDate: {
      type: Sequelize.DATE,
    },
    place: {
      type: Sequelize.INTEGER,
    },
    participant: {
      type: Sequelize.STRING,
    },
    totalPoints: {
      type: Sequelize.INTEGER,
    },
  })

  const Sprint = sequelize.define('sprint', {
    sprintNo: {
      type: Sequelize.INTEGER,
    },
    sprintPoints: {
      type: Sequelize.INTEGER,
    },
  })

  const Omnium = sequelize.define('omnium', {
    name: {
      type: Sequelize.STRING,
    },
    positionBefore: {
      type: Sequelize.INTEGER,
    },
    currentPosition: {
      type: Sequelize.INTEGER,
    },
    totalPoints: {
      type: Sequelize.INTEGER,
    },
    date: {
      type: Sequelize.DATE,
    },
    race: {
      type: Sequelize.INTEGER,
    },
  })

  Race.hasMany(Score, { foreignKey: 'raceNumber', sourceKey: 'score' })
  Omnium.hasMany(Race, { foreignKey: 'race', sourceKey: 'name' })
  Score.belongsTo(Cyclist, { foreignKey: 'participant', targetKey: 'uciCode' })
  Score.hasMany(Sprint, { foreignKey: 'sprint' })
  // checking for connection to DB
  sequelize
    .authenticate()
    .then(() => {
      console.log('Connection has been established successfully.')
    })
    .catch((err) => {
      console.error('Unable to connect to the database:', err)
    })
  return sequelize
}
module.exports = Connection
