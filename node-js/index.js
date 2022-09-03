import app from "./src/api/app.js";
import dynamoose from "dynamoose";
import dotenv from 'dotenv';

dotenv.config()
const { aws } = dynamoose;
aws.ddb.local();

app.listen(3000, () => console.log('I hear you, on http://localhost:3000'))