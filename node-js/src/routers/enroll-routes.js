import EnrollController from '../controllers/enroll-controller.js';
import express from 'express';
import rescue from 'express-rescue';
import ReportController from '../controllers/report-controller.js';
import JWTMiddleware from '../middleware/jwt-middleware.js';

const enrollRoutes = express.Router();
const jwtMiddleware = new JWTMiddleware();
const repControl = new ReportController();

enrollRoutes.post('/', rescue(EnrollController.postEnroll));
enrollRoutes.get('/report', rescue(jwtMiddleware.validateToken), rescue(repControl.getEnrolls));
enrollRoutes.get('/report/city/:city', rescue(jwtMiddleware.validateToken), rescue(repControl.getEnrollsByCity));
enrollRoutes.get('/report/status/:status', rescue(jwtMiddleware.validateToken), rescue(repControl.getEnrollsByStatus));
enrollRoutes.get('/report/id/:id', rescue(jwtMiddleware.validateToken), rescue(repControl.getEnrollById));

export { enrollRoutes };