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
// reportRoutes.get('/enroll/city/:city', rescue(logMiddleware), rescue(jwtMiddleware.validateToken), rescue(repControl.getEnrollsByCity), rescue(corsMiddleware));
// reportRoutes.get('/enroll/status/:status', rescue(logMiddleware), rescue(jwtMiddleware.validateToken), rescue(repControl.getEnrollsByStatus), rescue(corsMiddleware));
// reportRoutes.get('/enroll/id/:id', rescue(logMiddleware), rescue(jwtMiddleware.validateToken), rescue(repControl.getEnrollById), rescue(corsMiddleware));
reportRoutes.get('/user', rescue(logMiddleware), rescue(jwtMiddleware.validateToken), rescue(repControl.getUsers), rescue(corsMiddleware));
// reportRoutes.get('/user/id/:id', rescue(logMiddleware), rescue(jwtMiddleware.validateToken), rescue(repControl.getUserById), rescue(corsMiddleware));

export { reportRoutes };