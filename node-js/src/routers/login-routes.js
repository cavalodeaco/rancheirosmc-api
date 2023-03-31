const express = require('express');
const rescue = require('express-rescue');
const LoginController = require('../controllers/login-controller.js');
const corsMiddleware = require('../middleware/cors-middleware.js');
const logMiddleware = require('../middleware/log-middleware.js');

const loginRoutes = express.Router();

loginRoutes.post('/', rescue(logMiddleware), rescue(LoginController.doLogin), rescue(corsMiddleware));

module.exports = { loginRoutes };