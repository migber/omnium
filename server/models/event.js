'use strict'

module.exports = (sequelize, DataTypes) => {
  const Event = sequelize.define('Event', {
    name: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    positionBefore: DataTypes.INTEGER(6),
    currentPosition: DataTypes.INTEGER(6),
    totalPoints: DataTypes.INTEGER(6),
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  }, {})
  Event.associate = (models) => {
    // associations can be defined here
    Event.hasMany(models.Race, {
      foreignKey: 'EventId',
      onDelete: 'CASCADE',
    })
  }
  return Event
}
