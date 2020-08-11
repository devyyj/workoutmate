const { Router } = require('express')
const m = require('moment')

const card = require('../models/card')
const user = require('../models/user')
const passport = require('../passport')

const router = Router()

// join 개념 공부 필요!
// 제약조건 설정하지 않기 위해 constraints: false 추가
// user.hasMany(card, { foreignKey: 'user_id', constraints: false })
card.belongsTo(user, { foreignKey: 'user_id', constraints: false })

router.get('/card', async function (req, res, next) {
  let data
  if (req.query.id) {
    // 카드 수정
    data = await card.findOne({
      where: { id: req.query.id },
      include: { model: user, required: true },
      order: [['id', 'DESC']],
    })
  } else {
    // 카드 검색
    data = await card.findAll({
      include: { model: user },
      order: [['id', 'DESC']],
    })
  }
  res.send(data)
})

router.post(
  '/card',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const data = req.body
      await card.create({
        user_id: req.user.id,
        content: data.content,
        time: m(`${data.date}T${data.time}+09:00`),
        location: data.location,
        location_id: data.location_id,
        location_name: data.location_name,
        max: data.max,
        type: data.type,
        detail: data.detail.join(),
        cost: data.cost,
      })
      res.sendStatus(200)
    } catch (e) {
      console.log(e)
      res.sendStatus(500)
    }
  }
)

router.patch(
  '/card',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const data = req.body
      if (data.user_id !== req.user.id) return res.sendStatus(401)
      await card.update(
        {
          user_id: data.user_id,
          content: data.content,
          time: m(`${data.date}T${data.time}+09:00`),
          location: data.location,
          location_id: data.location_id,
          location_name: data.location_name,
          max: data.max,
          type: data.type,
          detail: data.detail.join(),
          cost: data.cost,
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
  '/card',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const data = req.query
      await card.destroy({ where: { id: data.id } })
      res.sendStatus(200)
    } catch (error) {
      console.log(error)
      res.sendStatus(500)
    }
  }
)

// 여기 이 함수가 있어도 될까...?
router.patch(
  '/join',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const data = req.body

      await card.update(
        {
          crew: data.crew,
        },
        {
          where: {
            id: data.id,
          },
        }
      )
      res.sendStatus(200)
    } catch (error) {
      res.sendStatus(500)
    }
  }
)

module.exports = router
