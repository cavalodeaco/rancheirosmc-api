import LegacyController from '../controllers/legacy-controller.js';
import express from 'express';
import rescue from 'express-rescue';
import corsMiddleware from '../middleware/cors-middleware.js';
import logMiddleware from '../middleware/log-middleware.js';

const legacyRoutes = express.Router();

legacyRoutes.post('/', rescue(logMiddleware), rescue(LegacyController.postEnroll), rescue(corsMiddleware));

export { legacyRoutes };