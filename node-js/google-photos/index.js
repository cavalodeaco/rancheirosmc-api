const serverless = require('serverless-http')
const express = require('express')
const bodyParser = require("body-parser");
const { getAlbum } = require('./google-photos')
const corsMiddleware = require("../src/middleware/cors-middleware.js");
const app = express()
app.use(bodyParser.json());
app.use(corsMiddleware)

app.post('/', async (req, res) => {
  try {
    console.log(req.body.id)
    const results = await getAlbum(req.body.id)
    res.json(results)
  } catch (e) {
    res.status(500)
  }
})

module.exports.handler = serverless(app)
// app.listen(3001, () => console.info("I hear you, on http://localhost:3001")); // local
