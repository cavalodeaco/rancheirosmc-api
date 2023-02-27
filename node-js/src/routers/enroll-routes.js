import EnrollController from '../controllers/enroll-controller.js';
import express from 'express';
import rescue from 'express-rescue';

const enrollRoutes = express.Router();

enrollRoutes.post('/', rescue(EnrollController.postEnroll));

export { enrollRoutes };