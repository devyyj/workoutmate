import { Router } from 'express'

const { sequelize, DataTypes } = require('../db')
const model = require('../models/users')
const router = Router()

const users = model(sequelize, DataTypes)

router.get('/users', async (req, res) => {
  const data = req.query
  res.send(await users.findOne({ where: { id: data.id } }))
})

router.post('/users', async (req, res) => {
  try {
    const data = req.body
    if (!(await users.findOne({ where: { id: data.id } }))) {
      await users.create({ id: data.id, nick_name: data.id })
    }
    res.sendStatus(200)
  } catch (error) {
    console.log(error)
  }
})

router.delete('/users', async (req, res) => {
  const data = req.query
  await users.destroy({ where: { id: data.id } })
  res.sendStatus(200)
})

module.exports = router
