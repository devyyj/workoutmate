const { Router } = require('express')
const m = require('moment')

const cards = require('../models/cards')
const users = require('../models/users')

const router = Router()

// join 개념 공부 필요!
cards.belongsTo(users, { foreignKey: 'user_id' })
users.hasMany(cards, { foreignKey: 'user_id' })

router.get('/cards', async function (req, res, next) {
  const data = await cards.findAll({
    include: { model: users, required: true },
    order: [['id', 'DESC']],
  })
  res.send(data)
})

router.post('/cards', async (req, res) => {
  try {
    const data = req.body
    await cards.create({
      user_id: data.user_id,
      content: data.content,
      workout_time: m(`${data.date}T${data.time}+09:00`),
      workout_location: data.location,
      workout_member: data.member,
      workout_type: data.type,
      workout_detail: data.detail.join(),
      workout_cost: data.cost,
    })
    res.sendStatus(200)
  } catch (e) {
    console.log(e)
    res.sendStatus(500)
  }
})

router.delete('/cards', async (req, res) => {
  try {
    const data = req.query
    await cards.destroy({ where: { id: data.id } })
    res.sendStatus(200)
  } catch (error) {
    console.log(error)
  }
})

module.exports = router
