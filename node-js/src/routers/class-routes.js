import express from 'express';
import rescue from 'express-rescue';
import corsMiddleware from '../middleware/cors-middleware.js';
import logMiddleware from '../middleware/log-middleware.js';
import ClassController from '../controllers/class-controller.js';

const classRoutes = express.Router();

classRoutes.post('/', rescue(logMiddleware), rescue(ClassController.post), rescue(corsMiddleware));

export { classRoutes };