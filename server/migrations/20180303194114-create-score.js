'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Scores', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      raceNumber: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      lapPlusPoints: {
        type: Sequelize.INTEGER,
      },
      lapMinusPoints: {
        type: Sequelize.INTEGER,
      },
      positionBefore: {
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
      totalPoints: {
        type: Sequelize.INTEGER,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      dns: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      dnq: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      dnf: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      bk: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      RaceId: {
        type: Sequelize.INTEGER,
        onDelete: 'CASCADE',
        references: {
          model: 'Races',
          key: 'id',
        },
      },
      CyclistId: {
        type: Sequelize.STRING,
        onDelete: 'CASCADE',
        references: {
          model: 'Cyclists',
          key: 'id',
        },
      },
    })
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Scores')
  },
}
