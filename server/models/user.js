'use strict'

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    email: {
      type: DataTypes.STRING(40),
      allowNull: false,
    },
    approved: DataTypes.BOOLEAN,
    accessToken: DataTypes.STRING(100),
    lastlogedIn: DataTypes.DATE,
    firstlogedIn: DataTypes.DATE,
    submitted: DataTypes.INTEGER(100000),
    phone: DataTypes.STRING(20),
    name: DataTypes.STRING(40),
    surname: DataTypes.STRING(100),
    googleId: DataTypes.STRING(300),
    img: DataTypes.STRING(160),
  }, {})
  User.associate = function associations(models) {
    User.hasMany(models.Cyclist, {
      foreignKey: 'id',
      onDelete: 'CASCADE',
    })
  }
  return User
}
