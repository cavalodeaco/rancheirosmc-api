import EnrollController from '../controllers/enroll/enroll-controller.js';
import express from 'express';
import rescue from 'express-rescue';

const apiRoutes = express.Router();

apiRoutes.get("/", (_req, res ) => {
  res.sendStatus(200);
});

apiRoutes.post('/enroll', rescue(EnrollController.postEnroll));

export default { apiRoutes }