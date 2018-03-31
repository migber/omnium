'use strict'

module.exports = (sequelize, DataTypes) => {
  const Event = sequelize.define('Event', {
    name: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    endDate: {
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
