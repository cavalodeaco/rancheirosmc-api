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
// enrollRoutes.get('/report/:page/:limit', rescue(jwtMiddleware.validateToken), rescue(repControl.getEnrollPaginated));
// enrollRoutes.get('/report/:city/:page/:limit', rescue(jwtMiddleware.validateToken), rescue(repControl.getEnrollByCityPaginated));
// enrollRoutes.get('/report/:status/:page/:limit', rescue(jwtMiddleware.validateToken), rescue(repControl.getEnrollByStatusPaginated));
enrollRoutes.get('/report/:id', rescue(jwtMiddleware.validateToken), rescue(repControl.getEnrollsById));

export { enrollRoutes };