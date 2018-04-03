'use strict'

module.exports = (sequelize, DataTypes) => {
  const Score = sequelize.define('Score', {
    raceNumber: {
      type: DataTypes.INTEGER(4),
      allowNull: false,
    },
    lapPlusPoints: DataTypes.INTEGER(6),
    lapMinusPoints: DataTypes.INTEGER(4),
    points: DataTypes.INTEGER(8),
    finishPlace: DataTypes.INTEGER(3),
    raceDate: DataTypes.DATE,
    place: DataTypes.INTEGER(3),
    positionBefore: DataTypes.INTEGER,
    totalPoints: DataTypes.INTEGER(6),
    dns: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    dnq: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    dnf: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    bk: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  }, {})
  Score.associate = (models) => {
    // associations can be defined here
    Score.hasMany(models.Sprint, {
      foreignKey: 'ScoreId',
      onDelete: 'CASCADE',
    })
    Score.belongsTo(models.Race, {
      foreignKey: 'RaceId',
      onDelete: 'CASCADE',
    })
    Score.belongsTo(models.Cyclist, {
      foreignKey: 'CyclistId',
      onDelete: 'CASCADE',
    })
  }
  return Score
}
