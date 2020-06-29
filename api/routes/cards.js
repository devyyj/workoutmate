const { Router } = require('express')
const { sequelize, DataTypes } = require('../db')
const model = require('../models/cards')

const router = Router()

const cards = model(sequelize, DataTypes)

/* GET users listing. */
router.get('/cards', async function (req, res, next) {
  res.send(await cards.findAll({ order: [['id', 'DESC']] }))
})

router.post('/cards', (req, res) => {
  try {
    const data = req.body
    cards.create({
      user: data.user,
      content: data.content,
      workout_time: `${data.date} ${data.time}`,
      workout_location: data.location,
      workout_member: data.member,
      workout_type: data.type,
      workout_detail: data.detail.join(),
      workout_cost: data.const,
    })
    res.sendStatus(200)
  } catch (e) {
    console.log(e)
    res.sendStatus(500)
  }
})

module.exports = router
