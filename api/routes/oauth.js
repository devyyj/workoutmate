import { Router } from 'express'

const router = Router()

router.get('/oauth', (req, res) => {
  console.log(req.query)
  res.send('oauth')
})

module.exports = router
