import { Router } from 'express'

const { sequelize, DataTypes } = require('../db')
const model = require('../models/users')
const router = Router()

const users = model(sequelize, DataTypes)

router.post('/users', async (req, res) => {
  try {
    const data = req.body
    console.log(req.body)
    if (!(await users.findOne({ where: { id: data.id } }))) {
      await users.create({ id: data.id, nick_name: data.id })
    }
    res.sendStatus(200)
  } catch (error) {
    console.log(error)
  }
})

router.delete('/users', (req, res) => {
  console.log('users deleteeeeeeeeeeeeeeeeeee', req.body)
  res.sendStatus(200)
})

module.exports = router
