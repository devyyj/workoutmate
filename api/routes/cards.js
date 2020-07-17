const { Router } = require('express')
const m = require('moment')

const cards = require('../models/cards')
const users = require('../models/users')
const passport = require('../passport')

const router = Router()

// join 개념 공부 필요!
// 제약조건 설정하지 않기 위해 constraints: false 추가
// users.hasMany(cards, { foreignKey: 'user_id', constraints: false })
cards.belongsTo(users, { foreignKey: 'user_id', constraints: false })

router.get('/cards', async function (req, res, next) {
  let data
  if (req.query.id) {
    // 카드 수정
    data = await cards.findOne({
      where: { id: req.query.id },
      include: { model: users, required: true },
      order: [['id', 'DESC']],
    })
  } else {
    // 카드 검색
    data = await cards.findAll({
      include: { model: users },
      order: [['id', 'DESC']],
    })
  }
  res.send(data)
})

router.post(
  '/cards',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
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
  }
)

router.patch(
  '/cards',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const data = req.body
      if (data.user_id !== req.user.id) return res.sendStatus(401)
      await cards.update(
        {
          user_id: data.user_id,
          content: data.content,
          workout_time: m(`${data.date}T${data.time}+09:00`),
          workout_location: data.location,
          workout_member: data.member,
          workout_type: data.type,
          workout_detail: data.detail.join(),
          workout_cost: data.cost,
        },
        {
          where: {
            id: data.id,
          },
        }
      )
      res.sendStatus(200)
    } catch (e) {
      console.log(e)
      res.sendStatus(500)
    }
  }
)

router.delete(
  '/cards',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const data = req.query
      await cards.destroy({ where: { id: data.id } })
      res.sendStatus(200)
    } catch (error) {
      console.log(error)
      res.sendStatus(500)
    }
  }
)

module.exports = router
