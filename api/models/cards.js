const { DataTypes } = require('sequelize')
const { sequelize } = require('./db')

module.exports = sequelize.define(
  'cards',
  {
    user_id: { type: DataTypes.STRING, allowNull: false },
    content: { type: DataTypes.STRING, allowNull: false },
    workout_time: { type: DataTypes.DATE, allowNull: false },
    workout_location: { type: DataTypes.STRING, allowNull: false },
    workout_member: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '1',
    },
    workout_type: { type: DataTypes.STRING, allowNull: false },
    workout_detail: { type: DataTypes.STRING, allowNull: false },
    workout_cost: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '0',
    },
  },
  {
    charset: 'utf8',
    collate: 'utf8_unicode_ci',
  }
)
