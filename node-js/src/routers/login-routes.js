import express from 'express';
import rescue from 'express-rescue';
import LoginController from '../controllers/login-controller.js';
import corsMiddleware from '../middleware/cors-middleware.js';
import logMiddleware from '../middleware/log-middleware.js';

const loginRoutes = express.Router();

loginRoutes.post('/', rescue(logMiddleware), rescue(LoginController.doLogin), rescue(corsMiddleware));

export { loginRoutes }