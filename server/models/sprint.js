'use strict'

module.exports = (sequelize, DataTypes) => {
  const Sprint = sequelize.define('Sprint', {
    sprintNumber: DataTypes.INTEGER(4),
    sprintPoints: DataTypes.INTEGER(5),
  }, {})
  Sprint.associate = (models) => {
    // associations can be defined here
    Sprint.belongsTo(models.Score, {
      foreignKey: 'ScoreId',
      onDelete: 'CASCADE',
    })
  }
  return Sprint
}
