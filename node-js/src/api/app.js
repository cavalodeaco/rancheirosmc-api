import cors from 'cors';
import express from 'express';
import bodyParser from 'body-parser';
import routes from './routes.js';
import errorMiddleware from '../middleware/error-middleware.js';

const app = express()

app.use(bodyParser.json())
app.use(cors())

app.use(routes.apiRoutes);
app.use(errorMiddleware);

export default app;