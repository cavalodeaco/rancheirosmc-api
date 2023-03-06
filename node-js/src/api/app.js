import cors from 'cors';
import express from 'express';
import bodyParser from 'body-parser';
import { loginRoutes } from '../routers/login-routes.js';
import { enrollRoutes } from '../routers/enroll-routes.js';
import errorMiddleware from '../middleware/error-middleware.js';
// import corsMiddleware from '../middleware/cors-middleware.js';
import { reportRoutes } from '../routers/report-routes.js';

const app = express()
app.use(bodyParser.json())  
app.use(cors());
app.use("/login", loginRoutes);
app.use("/enroll", enrollRoutes);
app.use("/report", reportRoutes);
// app.use(corsMiddleware);
app.use(errorMiddleware);

export default app;