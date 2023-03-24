import express from 'express';
import rescue from 'express-rescue';
import corsMiddleware from '../middleware/cors-middleware.js';
import logMiddleware from '../middleware/log-middleware.js';
import ClassController from '../controllers/class-controller.js';
import JWTMiddleware from '../middleware/jwt-middleware.js';

const classRoutes = express.Router();
const jwtMiddleware = new JWTMiddleware();

classRoutes.post('/', rescue(logMiddleware), rescue(jwtMiddleware.validateToken), rescue(ClassController.post), rescue(corsMiddleware));
classRoutes.get('/', rescue(logMiddleware), rescue(jwtMiddleware.validateToken), rescue(ClassController.get), rescue(corsMiddleware));
classRoutes.get('/download', rescue(logMiddleware), rescue(jwtMiddleware.validateToken), rescue(ClassController.download), rescue(corsMiddleware));

export { classRoutes };