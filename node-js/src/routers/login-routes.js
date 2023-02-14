import express from 'express';
import rescue from 'express-rescue';

const loginRoutes = express.Router();

loginRoutes.post('/login', rescue(LoginController.doLogin));

export default { loginRoutes }