require('dotenv').config()

const express = require('express')
const serverless = require('serverless-http')
const cors = require('cors')

const app = express()

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.send('Hello World!')
});


app.get('/test', (req, res) => {
  res.send('It works!')
});

if (process.env.ENV === 'development') {
  app.listen(3000, () => console.log('I hear you, on port 3000!'))
}

module.exports.handler = serverless(app)