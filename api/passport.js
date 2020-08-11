const passport = require('passport')
const JwtStrategy = require('passport-jwt').Strategy

const user = require('./models/user')

const cookieExtractor = function (req) {
  let token = null
  if (req && req.cookies) {
    token = req.cookies.jwt
  }
  return token
}

const opts = {
  jwtFromRequest: cookieExtractor,
  secretOrKey: 'secret',
  // issuer: 'accounts.examplesoft.com',
  // audience: 'workoutmate.kr',
}

passport.use(
  new JwtStrategy(opts, async function (jwtPayload, done) {
    try {
      const data = await user.findOne({ where: { id: jwtPayload.id } })
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

module.exports = passport
