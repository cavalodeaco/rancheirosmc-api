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
apiRoutes.post('/report/all', rescue(jwtMiddleware.validateToken), rescue(ReportController.getAll));

export default { apiRoutes }