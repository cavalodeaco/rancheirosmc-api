import dotenv from 'dotenv';
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

dotenv.config()

const dynamoParams = {
    region: `${process.env.AWS_REGION}`,
    endpoint: `http://${process.env.LOCAL_DYNAMO_URL}:${process.env.LOCAL_DYNAMO_PORT}`,
    accessKeyId: `${process.env.AWS_ACCESS_KEY_ID}`,
    secretAccessKey: `${process.env.AWS_SECRET_ACCESS_KEY}`
};

const dynamoDbClient = new DynamoDBClient(dynamoParams);

export { dynamoDbClient };