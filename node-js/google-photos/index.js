const serverless = require('serverless-http')
const express = require('express')
const { getAlbum } = require('./google-photos')
const corsMiddleware = require("../src/middleware/cors-middleware.js");
const app = express()
app.use(corsMiddleware)

app.get('/', async (req, res) => {
  try {
    console.log(req.query.id)
    const results = await getAlbum(req.query.id)
    res.json(results)
  } catch (e) {
    res.status(500)
  }
})

module.exports.handler = serverless(app)
// app.listen(3001, () => console.info("I hear you, on http://localhost:3001")); // local
