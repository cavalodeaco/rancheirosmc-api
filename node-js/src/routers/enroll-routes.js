import EnrollController from '../controllers/enroll-controller.js';
import express from 'express';
import rescue from 'express-rescue';
import corsMiddleware from '../middleware/cors-middleware.js';
import logMiddleware from '../middleware/log-middleware.js';

const enrollRoutes = express.Router();

enrollRoutes.post('/', rescue(logMiddleware), rescue(EnrollController.postEnroll), rescue(corsMiddleware));
enrollRoutes.post('/call', rescue(logMiddleware), rescue(EnrollController.postCall), rescue(corsMiddleware));
enrollRoutes.post('/confirm', rescue(logMiddleware), rescue(EnrollController.postConfirm), rescue(corsMiddleware));
enrollRoutes.post('/certify', rescue(logMiddleware), rescue(EnrollController.postCertify), rescue(corsMiddleware));
enrollRoutes.post('/miss', rescue(logMiddleware), rescue(EnrollController.postMiss), rescue(corsMiddleware));
enrollRoutes.post('/drop', rescue(logMiddleware), rescue(EnrollController.postDrop), rescue(corsMiddleware));

export { enrollRoutes };