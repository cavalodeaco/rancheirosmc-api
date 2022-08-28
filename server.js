const express = require('express')
const serverless = require('serverless-http')
const app = express()

app.get('/', (req, res) => {
  res.send('Hello World!')
});


app.get('/test', (req, res) => {
  res.send('It works!')
});

module.exports.handler = serverless(app);
