'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Sprints', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      sprintNumber: {
        type: Sequelize.INTEGER,
      },
      sprintPoints: {
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
      ScoreId: {
        type: Sequelize.INTEGER,
        onDelete: 'CASCADE',
        references: {
          model: 'Scores',
          key: 'id',
        },
      },
    })
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Sprints')
  },
}
