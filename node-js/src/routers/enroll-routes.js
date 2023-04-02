const EnrollController = require('../controllers/enroll-controller.js');
const express = require('express');
const rescue = require('express-rescue');
const corsMiddleware = require('../middleware/cors-middleware.js');
const logMiddleware = require('../middleware/log-middleware.js');

const enrollRoutes = express.Router();

enrollRoutes.post('/', rescue(logMiddleware), rescue(EnrollController.postEnroll), rescue(corsMiddleware));

module.exports = { enrollRoutes };