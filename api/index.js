const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const passport = require('./passport')
const app = express()

app.use(passport.initialize())
app.use(cookieParser())
app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

// Import API Routes
app.use(require('./routes/cards'))
app.use(require('./routes/users'))

app.get('/', function (req, res) {
  res.send('pong!')
})

// 로그인 상태 확인. 토큰이 없으면 401 리턴.
app.get(
  '/isLogin',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    res.sendStatus(200)
  }
)

app.get('/logout', (req, res) => {
  res.clearCookie('jwt', { httpOnly: true }).sendStatus(200)
})

// 내 아이디 확인
app.get(
  '/myid',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    res.send(req.user.id)
  }
)

// Export the server middleware
module.exports = {
  path: '/api',
  handler: app,
}
