'use strict'

module.exports = (sequelize, DataTypes) => {
  const Race = sequelize.define('Race', {
    elapseTime: {
      type: DataTypes.STRING,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    communique: DataTypes.STRING(800),
    avgSpeed: DataTypes.DECIMAL(5.3),
    order: DataTypes.INTEGER(4),
    description: {
      type: DataTypes.STRING(300),
      allowNull: false,
    },
  }, {})
  Race.associate = (models) => {
    // associations can be defined here
    Race.hasMany(models.Score, {
      foreignKey: 'RaceId',
      onDelete: 'CASCADE',
    })
    Race.belongsTo(models.Event, {
      foreignKey: 'EventId',
      onDelete: 'CASCADE',
    })
  }
  return Race
}
