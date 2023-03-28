import ManagerController from '../controllers/manager-controller.js';
import express from 'express';
import rescue from 'express-rescue';
import corsMiddleware from '../middleware/cors-middleware.js';
import logMiddleware from '../middleware/log-middleware.js';
import JWTMiddleware from '../middleware/jwt-middleware.js';

const managerRoutes = express.Router();
const jwtMiddleware = new JWTMiddleware();

managerRoutes.post('/call', rescue(logMiddleware), rescue(jwtMiddleware.validateToken), rescue(ManagerController.postCall), rescue(corsMiddleware));
managerRoutes.post('/confirm', rescue(logMiddleware), rescue(jwtMiddleware.validateToken), rescue(ManagerController.postConfirm), rescue(corsMiddleware));
managerRoutes.post('/certify', rescue(logMiddleware), rescue(jwtMiddleware.validateToken), rescue(ManagerController.postCertify), rescue(corsMiddleware));
managerRoutes.post('/miss', rescue(logMiddleware), rescue(jwtMiddleware.validateToken), rescue(ManagerController.postMiss), rescue(corsMiddleware));
managerRoutes.post('/drop', rescue(logMiddleware), rescue(jwtMiddleware.validateToken), rescue(ManagerController.postDrop), rescue(corsMiddleware));
managerRoutes.post('/ignore', rescue(logMiddleware), rescue(jwtMiddleware.validateToken), rescue(ManagerController.postIgnore), rescue(corsMiddleware));
managerRoutes.post('/wait', rescue(logMiddleware), rescue(jwtMiddleware.validateToken), rescue(ManagerController.postWait), rescue(corsMiddleware));
managerRoutes.put('/enroll', rescue(logMiddleware), rescue(jwtMiddleware.validateToken), rescue(ManagerController.updateEnroll), rescue(corsMiddleware));
managerRoutes.put('/class', rescue(logMiddleware), rescue(jwtMiddleware.validateToken), rescue(ManagerController.updateClass), rescue(corsMiddleware));

export { managerRoutes };