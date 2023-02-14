import app from "./api/app.js";
import serverless from 'serverless-http';
export const handler = serverless(app)