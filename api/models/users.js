const { DataTypes } = require('sequelize')
const { sequelize } = require('./db')

module.exports = sequelize.define(
  'users',
  {
    id: { type: DataTypes.STRING, primaryKey: true, allowNull: false },
    nick_name: { type: DataTypes.STRING, allowNull: false },
  },
  {
    charset: 'utf8',
    collate: 'utf8_unicode_ci',
  }
)
