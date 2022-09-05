import app from "./api/app.js";
import serverless from 'serverless-http';
import {UserModelDynamo} from './model/user-model.js';
import {EnrollModelDynamo} from './model/enroll-model.js';

const TableDynamo = new Table(process.env.TABLE_NAME, [UserModelDynamo, EnrollModelDynamo])

export const handler = serverless(app)