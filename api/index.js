const express = require('express')
const bodyParser = require('body-parser')

const passport = require('passport')
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt

const users = require('./models/users')

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: 'secret',
  // issuer: 'accounts.examplesoft.com',
  // audience: 'workoutmate.kr',
}

passport.use(
  new JwtStrategy(opts, async function (jwtPayload, done) {
    try {
      const data = await users.findOne({ where: { id: jwtPayload.id } })
      if (data) {
        return done(null, data)
      } else {
        return done(null, false)
      }
    } catch (error) {
      return done(error, false)
    }
  })
)

const app = express()

app.use(passport.initialize())
app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

// Import API Routes
app.use(require('./routes/cards'))
app.use(require('./routes/users'))

app.get('/', function (req, res) {
  res.send('pong!')
})

// 로그인 상태 확인 라우트 작성

// 내 아이디 확인 라우트 작성

// Export the server middleware
module.exports = {
  path: '/api',
  handler: app,
}
