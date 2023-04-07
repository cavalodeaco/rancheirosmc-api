const dotenv = require("dotenv");
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");

dotenv.config();

const dynamoParams = {
  region: `${process.env.AWS_REGION}`,
  accessKeyId: `${process.env.AWS_ACCESS_KEY_ID}`,
  secretAccessKey: `${process.env.AWS_SECRET_ACCESS_KEY}`,
};

if (process.env.ENV == "local") {
  dynamoParams.endpoint = `http://${process.env.LOCAL_DYNAMO_URL}:${process.env.LOCAL_DYNAMO_PORT}`;
}

const dynamoDbClient = new DynamoDBClient(dynamoParams);

module.exports = { dynamoDbClient };
