const { DataTypes } = require('sequelize')
const { sequelize } = require('./db')

module.exports = sequelize.define(
  'user',
  {
    id: { type: DataTypes.STRING, primaryKey: true, allowNull: false },
    nick_name: { type: DataTypes.STRING, unique: true, allowNull: false },
    infomation: { type: DataTypes.STRING },
    picture: { type: DataTypes.STRING },
  },
  {
    charset: 'utf8',
    collate: 'utf8_unicode_ci',
  }
)
