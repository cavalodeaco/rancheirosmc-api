import ManagerController from '../controllers/manager-controller.js';
import express from 'express';
import rescue from 'express-rescue';
import corsMiddleware from '../middleware/cors-middleware.js';
import logMiddleware from '../middleware/log-middleware.js';

const managerRoutes = express.Router();

managerRoutes.post('/call', rescue(logMiddleware), rescue(ManagerController.postCall), rescue(corsMiddleware));
managerRoutes.post('/confirm', rescue(logMiddleware), rescue(ManagerController.postConfirm), rescue(corsMiddleware));
managerRoutes.post('/certify', rescue(logMiddleware), rescue(ManagerController.postCertify), rescue(corsMiddleware));
managerRoutes.post('/miss', rescue(logMiddleware), rescue(ManagerController.postMiss), rescue(corsMiddleware));
managerRoutes.post('/drop', rescue(logMiddleware), rescue(ManagerController.postDrop), rescue(corsMiddleware));

export { managerRoutes };