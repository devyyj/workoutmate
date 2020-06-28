module.exports = async (sequelize, DataTypes) => {
  const model = await sequelize.define(
    'cards',
    {
      user: { type: DataTypes.STRING, allowNull: false },
      content: { type: DataTypes.STRING, allowNull: false },
      workout_time: { type: DataTypes.DATE, allowNull: false },
      workout_location: { type: DataTypes.STRING, allowNull: false },
      workout_member: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: 1,
      },
      workout_type: { type: DataTypes.STRING, allowNull: false },
      workout_detail: { type: DataTypes.STRING, allowNull: false },
      workout_cost: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
    },
    {
      // Other model options go here
    }
  )
  await sequelize.sync()
  return model
}
