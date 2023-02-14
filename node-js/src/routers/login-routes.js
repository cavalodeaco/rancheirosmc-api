import express from 'express';
import rescue from 'express-rescue';
import LoginController from '../controllers/login-controller.js';

const loginRoutes = express.Router();

loginRoutes.post('/', rescue(LoginController.doLogin));

export { loginRoutes }