import { Router } from 'express'
const jwt = require('jsonwebtoken')
const users = require('../models/users')
const router = Router()

const passport = require('../passport')

router.get(
  '/users',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      res.send(await users.findOne({ where: { id: req.user.id } }))
    } catch (error) {
      console.log(error)
      res.sendStatus(500)
    }
  }
)

router.post('/users', async (req, res) => {
  try {
    const data = req.body
    if (!(await users.findOne({ where: { id: data.id } }))) {
      await users.create({ id: data.id, nick_name: data.id })
    }
    res.cookie('jwt', jwt.sign({ id: data.id }, 'secret'), { httpOnly: true })
    res.sendStatus(200)
  } catch (error) {
    console.log(error)
    res.sendStatus(500)
  }
})

router.patch(
  '/users',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const data = req.body
      await users.update(
        { nick_name: data.nick_name },
        { where: { id: req.user.id } }
      )
      res.sendStatus(200)
    } catch (error) {
      if (error.errors[0].type === 'unique violation') res.sendStatus(400)
      else res.sendStatus(500)
    }
  }
)

router.delete(
  '/users',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      await users.destroy({ where: { id: req.user.id } })
      res.sendStatus(200)
    } catch (error) {
      console.log(error)
      res.sendStatus(500)
    }
  }
)

module.exports = router
