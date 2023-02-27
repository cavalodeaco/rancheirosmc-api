import EnrollController from '../controllers/enroll-controller.js';
import express from 'express';
import rescue from 'express-rescue';
import ReportController from '../controllers/report-controller.js';
import JWTMiddleware from '../middleware/jwt-middleware.js';

const reportRoutes = express.Router();
const jwtMiddleware = new JWTMiddleware();
const repControl = new ReportController();

reportRoutes.get('/enroll', rescue(jwtMiddleware.validateToken), rescue(repControl.getEnrolls));
reportRoutes.get('/enroll/city/:city', rescue(jwtMiddleware.validateToken), rescue(repControl.getEnrollsByCity));
reportRoutes.get('/enroll/status/:status', rescue(jwtMiddleware.validateToken), rescue(repControl.getEnrollsByStatus));
reportRoutes.get('/enroll/id/:id', rescue(jwtMiddleware.validateToken), rescue(repControl.getEnrollById));
reportRoutes.get('/user', rescue(jwtMiddleware.validateToken), rescue(repControl.getUsers));
reportRoutes.get('/user/id/:id', rescue(jwtMiddleware.validateToken), rescue(repControl.getUserById));

export { reportRoutes };