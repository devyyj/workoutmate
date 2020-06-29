import config from './config'
const { Sequelize, DataTypes } = require('sequelize')

const sequelize = new Sequelize(
  // eslint-disable-next-line no-useless-escape
  `${config.db.dialect}://${config.db.user}:${config.db.pass}@${config.db.host}:${config.db.port}/${config.db.name}`,
  { dialectOptions: { timezone: 'Etc/GMT0' } }
)

try {
  ;(async () => {
    await sequelize.authenticate()
    console.log('Connection has been established successfully.')
    require('./models/cards')(sequelize, DataTypes)
    await sequelize.sync()
  })()
} catch (error) {
  console.error('Unable to connect to the database:', error)
}

module.exports = { sequelize, DataTypes }
