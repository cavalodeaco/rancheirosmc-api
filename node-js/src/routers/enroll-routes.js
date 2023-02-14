import EnrollController from '../controllers/enroll-controller.js';
import express from 'express';
import rescue from 'express-rescue';
import ReportController from '../controllers/report-controller.js';
import JWTMiddleware from '../middleware/jwt-middleware.js';

const enrollRoute = express.Router();
const jwtMiddleware = new JWTMiddleware();
const repControl = new ReportController();

enrollRoute.post('/', rescue(EnrollController.postEnroll));
enrollRoute.get('/report', rescue(jwtMiddleware.validateToken), rescue(repControl.getEnrolls));
// enrollRoute.get('/report/:page/:limit', rescue(jwtMiddleware.validateToken), rescue(repControl.getEnrollPaginated));
// enrollRoute.get('/report/:city/:page/:limit', rescue(jwtMiddleware.validateToken), rescue(repControl.getEnrollByCityPaginated));
// enrollRoute.get('/report/:status/:page/:limit', rescue(jwtMiddleware.validateToken), rescue(repControl.getEnrollByStatusPaginated));
enrollRoute.get('/report/:id', rescue(jwtMiddleware.validateToken), rescue(repControl.getEnrollsById));

export default { enrollRoute }