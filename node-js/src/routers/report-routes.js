import express from 'express';
import rescue from 'express-rescue';
import ReportController from '../controllers/report-controller.js';
import JWTMiddleware from '../middleware/jwt-middleware.js';
import logMiddleware from '../middleware/log-middleware.js';
import corsMiddleware from '../middleware/cors-middleware.js';

const reportRoutes = express.Router();
const jwtMiddleware = new JWTMiddleware();
const repControl = new ReportController();

reportRoutes.get('/enroll', rescue(logMiddleware), rescue(jwtMiddleware.validateToken), (repControl.getEnrolls), rescue(corsMiddleware));
reportRoutes.get('/user', rescue(logMiddleware), rescue(jwtMiddleware.validateToken), rescue(repControl.getUsers), rescue(corsMiddleware));

export { reportRoutes };