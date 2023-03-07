import express from 'express';
import rescue from 'express-rescue';
import ReportController from '../controllers/report-controller.js';
import JWTMiddleware from '../middleware/jwt-middleware.js';
import corsMiddleware from '../middleware/cors-middleware.js';

const reportRoutes = express.Router();
const jwtMiddleware = new JWTMiddleware();
const repControl = new ReportController();

reportRoutes.get('/enroll', rescue(jwtMiddleware.validateToken), (repControl.getEnrolls), rescue(corsMiddleware));
reportRoutes.get('/enroll/city/:city', rescue(jwtMiddleware.validateToken), rescue(repControl.getEnrollsByCity), rescue(corsMiddleware));
reportRoutes.get('/enroll/status/:status', rescue(jwtMiddleware.validateToken), rescue(repControl.getEnrollsByStatus), rescue(corsMiddleware));
reportRoutes.get('/enroll/id/:id', rescue(jwtMiddleware.validateToken), rescue(repControl.getEnrollById), rescue(corsMiddleware));
reportRoutes.get('/user', rescue(jwtMiddleware.validateToken), rescue(repControl.getUsers), rescue(corsMiddleware));
reportRoutes.get('/user/id/:id', rescue(jwtMiddleware.validateToken), rescue(repControl.getUserById), rescue(corsMiddleware));

export { reportRoutes };