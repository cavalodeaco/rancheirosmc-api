import app from "./api/app.js";
import serverless from 'serverless-http';
import {UserModelDynamo} from './src/model/user-model.js';
import {EnrollModelDynamo} from './src/model/enroll-model.js';

const TableDynamo = new Table(process.env.TABLE_NAME, [UserModelDynamo, EnrollModelDynamo])

export const handler = serverless(app)