require('dotenv').config()

const express = require('express')
const serverless = require('serverless-http')
const cors = require('cors')

const app = express()

app.use(cors())
app.use(express.json())

app.get('/test', (req, res) => {
  res.send('Hello from server!')
});

app.get('/status', (req, res) => {
  res.send("OK");
});

if (process.env.ENV === 'development') {
  app.listen(3000, () => console.log('I hear you, on port 3000!'))
}

module.exports.handler = serverless(app)
