import cors from 'cors';
import express from 'express';
import bodyParser from 'body-parser';
import {loginRoutes} from '../routers/login-routes.js';
import {enrollRoute} from '../routers/enroll-routes.js';
import {userRoutes} from '../routers/user-routes.js';
import errorMiddleware from '../middleware/error-middleware.js';

const app = express()

app.use(bodyParser.json())
app.use(cors())

app.use("/login", loginRoutes);
app.use("/enroll", enrollRoute);
app.use("/user", userRoutes);
app.use(errorMiddleware);

export default app;