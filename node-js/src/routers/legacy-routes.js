import LegacyController from '../controllers/legacy-controller.js';
import express from 'express';
import rescue from 'express-rescue';
import corsMiddleware from '../middleware/cors-middleware.js';
import logMiddleware from '../middleware/log-middleware.js';
import JWTMiddleware from '../middleware/jwt-middleware.js';

const legacyRoutes = express.Router();
const jwtMiddleware = new JWTMiddleware();

legacyRoutes.post('/', rescue(logMiddleware), rescue(jwtMiddleware.validateToken), rescue(LegacyController.postEnroll), rescue(corsMiddleware));

export { legacyRoutes };