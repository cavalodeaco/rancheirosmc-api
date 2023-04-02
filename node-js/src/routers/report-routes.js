const express = require('express');
const rescue = require('express-rescue');
const ReportController = require('../controllers/report-controller.js');
const JWTMiddleware = require('../middleware/jwt-middleware.js');
const logMiddleware = require('../middleware/log-middleware.js');
const corsMiddleware = require('../middleware/cors-middleware.js');

const reportRoutes = express.Router();
const jwtMiddleware = new JWTMiddleware();
const repControl = new ReportController();

reportRoutes.get('/enroll', rescue(logMiddleware), rescue(jwtMiddleware.validateToken), (repControl.getEnrolls), rescue(corsMiddleware));
reportRoutes.get('/user', rescue(logMiddleware), rescue(jwtMiddleware.validateToken), rescue(repControl.getUsers), rescue(corsMiddleware));

module.exports = { reportRoutes };