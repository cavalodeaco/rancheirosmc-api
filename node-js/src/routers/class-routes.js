import express from 'express';
import rescue from 'express-rescue';
import corsMiddleware from '../middleware/cors-middleware.js';
import logMiddleware from '../middleware/log-middleware.js';
import ClassController from '../controllers/class-controller.js';

const classRoutes = express.Router();

classRoutes.post('/', rescue(logMiddleware), rescue(jwtMiddleware.validateToken), rescue(ClassController.post), rescue(corsMiddleware));
classRoutes.get('/', rescue(logMiddleware), rescue(jwtMiddleware.validateToken), rescue(ClassController.get), rescue(corsMiddleware));

export { classRoutes };