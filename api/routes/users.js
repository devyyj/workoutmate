import { Router } from 'express'
const jwt = require('jsonwebtoken')
const users = require('../models/users')
const router = Router()

const passport = require('../passport')

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
    res.cookie('jwt', jwt.sign({ id: data.id }, 'secret'), { httpOnly: true })
    res.sendStatus(200)
  } catch (error) {
    console.log(error)
  }
})

router.delete(
  '/users',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    await users.destroy({ where: { id: req.user.id } })
    res.sendStatus(200)
  }
)

module.exports = router
