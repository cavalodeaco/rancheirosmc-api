import EnrollController from '../controllers/enroll-controller.js';
import express from 'express';
import rescue from 'express-rescue';
import corsMiddleware from '../middleware/cors-middleware.js';
import logMiddleware from '../middleware/log-middleware.js';

const enrollRoutes = express.Router();

enrollRoutes.post('/', rescue(logMiddleware), rescue(EnrollController.postEnroll), rescue(corsMiddleware));
enrollRoutes.post('/call', rescue(logMiddleware), rescue(EnrollController.postCall), rescue(corsMiddleware));

export { enrollRoutes };