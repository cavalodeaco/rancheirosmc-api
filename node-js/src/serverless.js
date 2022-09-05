import app from "./api/app.js";
import serverless from 'serverless-http';
import dynamoose from "dynamoose";
import {UserModelDynamo} from './model/user-model.js';
import {EnrollModelDynamo} from './model/enroll-model.js';

const TableDynamo = new dynamoose.Table(process.env.TABLE_NAME, [UserModelDynamo, EnrollModelDynamo])

export const handler = serverless(app)