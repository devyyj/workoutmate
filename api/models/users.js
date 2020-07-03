module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    'users',
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, allowNull: false },
      nick_name: { type: DataTypes.STRING, allowNull: false },
    },
    {
      charset: 'utf8',
      collate: 'utf8_unicode_ci',
    }
  )
}
