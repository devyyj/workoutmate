const express = require('express')

// Create express instance
const app = express()

// Require API routes
const bodyParser = require('body-parser')
const users = require('./routes/cards')

app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
// Import API Routes
app.use(users)

app.get('/', function (req, res, next) {
  res.send('pong!')
})

// Export the server middleware
module.exports = {
  path: '/api',
  handler: app,
}
