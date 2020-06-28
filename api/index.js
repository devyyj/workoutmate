const express = require('express')

// Create express instance
const app = express()

// Require API routes
const users = require('./routes/cards')

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
