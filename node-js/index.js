import app from "./src/api/app.js";
import dynamoose from "dynamoose";
import dotenv from 'dotenv';
import {UserModelDynamo} from './src/model/user-model.js';
import {EnrollModelDynamo} from './src/model/enroll-model.js';

dotenv.config()
const { aws, Table } = dynamoose;
aws.ddb.local();

const TableDynamo = new Table(process.env.TABLE_NAME, [UserModelDynamo, EnrollModelDynamo])

app.listen(3000, () => console.log('I hear you, on http://localhost:3000'))