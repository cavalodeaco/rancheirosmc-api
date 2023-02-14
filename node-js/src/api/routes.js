import EnrollController from '../controllers/enroll/enroll-controller.js';
import express from 'express';
import rescue from 'express-rescue';
import LoginController from '../controllers/login/login-controller.js';
import ReportController from '../controllers/report/report-controller.js';
import JWTMiddleware from '../middleware/jwt-middleware.js';

const apiRoutes = express.Router();
const jwtMiddleware = new JWTMiddleware();
const repControl = new ReportController();

apiRoutes.get("/", (_req, res ) => {
  res.sendStatus(200);
});

apiRoutes.post('/enroll', rescue(EnrollController.postEnroll));
apiRoutes.post('/login', rescue(LoginController.doLogin));
apiRoutes.get('/report/enroll', rescue(jwtMiddleware.validateToken), rescue(repControl.getEnrolls));
// apiRoutes.get('/report/enroll/:page/:limit', rescue(jwtMiddleware.validateToken), rescue(repControl.getEnrollPaginated));
// apiRoutes.get('/report/enroll/:city/:page/:limit', rescue(jwtMiddleware.validateToken), rescue(repControl.getEnrollByCityPaginated));
// apiRoutes.get('/report/enroll/:status/:page/:limit', rescue(jwtMiddleware.validateToken), rescue(repControl.getEnrollByStatusPaginated));
apiRoutes.get('/report/enroll/:id', rescue(jwtMiddleware.validateToken), rescue(repControl.getEnrollById));
apiRoutes.get('/report/user', rescue(jwtMiddleware.validateToken), rescue(repControl.getUsers));
apiRoutes.get('/report/user/:id', rescue(jwtMiddleware.validateToken), rescue(repControl.getUserById));

export default { apiRoutes }