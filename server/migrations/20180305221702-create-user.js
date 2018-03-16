'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Users', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    approved: {
      type: Sequelize.BOOLEAN,
    },
    accessToken: {
      type: Sequelize.STRING,
    },
    lastlogedIn: {
      type: Sequelize.DATE,
    },
    firstlogedIn: {
      type: Sequelize.DATE,
    },
    submitted: {
      type: Sequelize.INTEGER,
    },
    phone: {
      type: Sequelize.STRING,
    },
    name: {
      type: Sequelize.STRING,
    },
    surname: {
      type: Sequelize.STRING,
    },
    googleId: {
      type: Sequelize.STRING,
    },
    img: {
      type: Sequelize.STRING,
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
  }),
  down: (queryInterface, Sequelize) => queryInterface.dropTable('Users'),
}
