import { Router } from 'express'
const jwt = require('jsonwebtoken')
const users = require('../models/users')
const router = Router()

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
    res.send(jwt.sign({ id: data.id }, 'secret'))
  } catch (error) {
    console.log(error)
  }
})

router.delete('/users', async (req, res) => {
  const data = req.query
  await users.destroy({ where: { id: data.id } })
  res.sendStatus(200)
})

// passport.authenticate('jwt', { session: false })
module.exports = router
