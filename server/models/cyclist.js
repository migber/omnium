'use strict'

module.exports = (sequelize, DataTypes) => {
  const Cyclist = sequelize.define('Cyclist', {
    firstName: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    uciCode: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
    },
    team: {
      type: DataTypes.STRING(250),
      allowNull: false,
    },
    nationality: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    birthdate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    gender: {
      type: DataTypes.STRING(15),
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING(40),
      allowNull: false,
    },
    approved: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  }, {})
  Cyclist.associate = (models) => {
    // associations can be defined here
    Cyclist.hasMany(models.Score, {
      foreignKey: 'CyclistId',
      onDelete: 'CASCADE',
    })
  }
  return Cyclist
}
