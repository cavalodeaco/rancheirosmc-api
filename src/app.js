const express = require('express')
const cors = require('cors')
const rescue = require('express-rescue')
const bodyParser = require('body-parser')
const routes = require('./routes')

const app = express()

app.use(bodyParser.json())
app.use(cors())

const apiRoutes = express.Router();

apiRoutes.get("/", (_req, res ) => {
  res.sendStatus(200);
});

apiRoutes.post('/enroll', rescue(routes.enrollToWaitingList));

app.use(apiRoutes);

module.exports = app;
