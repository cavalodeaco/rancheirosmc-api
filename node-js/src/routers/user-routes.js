import EnrollController from '../controllers/enroll-controller.js';
import express from 'express';
import rescue from 'express-rescue';
import ReportController from '../controllers/report-controller.js';
import JWTMiddleware from '../middleware/jwt-middleware.js';

const userRoutes = express.Router();
const jwtMiddleware = new JWTMiddleware();
const repControl = new ReportController();

userRoutes.get('/report/user', rescue(jwtMiddleware.validateToken), rescue(repControl.getUsers));
userRoutes.get('/report/user/:id', rescue(jwtMiddleware.validateToken), rescue(repControl.getUserById));

export { userRoutes }