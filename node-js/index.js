import dotenv from 'dotenv';
dotenv.config()

import app from "./src/api/app.js";

// Create table if not exists
import { dynamoDbClient } from './src/libs/ddb-client.js';
import { CreateTableCommand } from "@aws-sdk/client-dynamodb";

const paramsUser = {
    TableName: `${process.env.TABLE_NAME}-user`,
    KeySchema: [
        { AttributeName: "PK", KeyType: "HASH" }
    ],
    AttributeDefinitions: [
        { AttributeName: "PK", AttributeType: "S" }
    ],
    ProvisionedThroughput: {
        ReadCapacityUnits: 1,
        WriteCapacityUnits: 1
    }
};
dynamoDbClient.send(new CreateTableCommand(paramsUser)).then((data) => {
    console.log(`Table user Created `, data);
}).catch((err) => {
    if (err.name === "ResourceInUseException") {
        console.log(`Table user already exists `);
    } else {
        throw err;
    }
});

const paramsEnroll = {
    TableName: `${process.env.TABLE_NAME}-enroll`,
    KeySchema: [
        { AttributeName: "PK", KeyType: "HASH" },
        { AttributeName: "SK", KeyType: "RANGE" }
    ],
    AttributeDefinitions: [
        { AttributeName: "PK", AttributeType: "S" },
        { AttributeName: "SK", AttributeType: "S" }
    ],
    ProvisionedThroughput: {
        ReadCapacityUnits: 1,
        WriteCapacityUnits: 1
    }
};
dynamoDbClient.send(new CreateTableCommand(paramsEnroll)).then((data) => {
    console.log(`Table enroll Created `, data);
}).catch((err) => {
    if (err.name === "ResourceInUseException") {
        console.log(`Table enroll already exists `);
    } else {
        throw err;
    }
});

// import dynamoose from "dynamoose";
// import { UserModelDynamo } from './src/model/user-model.js';
// import { EnrollModelDynamo } from './src/model/enroll-model.js';
// const { aws, Table } = dynamoose;
// aws.ddb.local(`http://${process.env.LOCAL_DYNAMO_URL}:${process.env.LOCAL_DYNAMO_PORT}`);
// const TableDynamo = new Table(process.env.TABLE_NAME, [UserModelDynamo, EnrollModelDynamo])

app.listen(3001, () => console.log('I hear you, on http://localhost:3001'))
