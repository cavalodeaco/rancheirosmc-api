import EnrollController from '../controllers/enroll/enroll-controller.js';
import express from 'express';
import rescue from 'express-rescue';
import LoginController from '../controllers/login/login-controller.js';
import ReportController from '../controllers/report/report-controller.js';
import JWTMiddleware from '../middleware/jwt-middleware.js';

const apiRoutes = express.Router();
const jwtMiddleware = new JWTMiddleware();

apiRoutes.get("/", (_req, res ) => {
  res.sendStatus(200);
});

apiRoutes.post('/enroll', rescue(EnrollController.postEnroll));
apiRoutes.post('/login', rescue(LoginController.doLogin));
apiRoutes.get('/report/:page/:limit', rescue(jwtMiddleware.validateToken), rescue(ReportController.getAllPaginated));
apiRoutes.get('/report/:city/:page/:limit', rescue(jwtMiddleware.validateToken), rescue(ReportController.getAllByCityPaginated));
apiRoutes.get('/report/:status/:page/:limit', rescue(jwtMiddleware.validateToken), rescue(ReportController.getAllByStatusPaginated));

export default { apiRoutes }