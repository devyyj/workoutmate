const { Router } = require('express')
const { sequelize, DataTypes } = require('../db')
const model = require('../models/cards')

const router = Router()

/* GET users listing. */
router.get('/cards', async function (req, res, next) {
  const cards = await model(sequelize, DataTypes)
  res.send(await cards.findAll())
})

module.exports = router
