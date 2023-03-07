import express from 'express';
import rescue from 'express-rescue';
import LoginController from '../controllers/login-controller.js';
import corsMiddleware from '../middleware/cors-middleware.js';

const loginRoutes = express.Router();

loginRoutes.post('/', rescue(LoginController.doLogin), rescue(corsMiddleware));

export { loginRoutes }