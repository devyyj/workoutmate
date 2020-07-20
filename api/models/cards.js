const { DataTypes } = require('sequelize')
const { sequelize } = require('./db')

module.exports = sequelize.define(
  'cards',
  {
    user_id: { type: DataTypes.STRING, allowNull: false },
    content: { type: DataTypes.STRING, allowNull: false },
    time: { type: DataTypes.DATE, allowNull: false },
    location: { type: DataTypes.STRING, allowNull: false },
    type: { type: DataTypes.STRING, allowNull: false },
    detail: { type: DataTypes.STRING, allowNull: false },
    max: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '1',
    },
    cost: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '0',
    },
    crew: {
      type: DataTypes.STRING(1100),
      allowNull: false,
      defaultValue: '',
      comment:
        '콤마로 유저 ID를 구분한다. ID + 콤마(10 + 1) * 최대 참여 인원(99) < 1100',
    },
  },
  {
    charset: 'utf8',
    collate: 'utf8_unicode_ci',
  }
)
