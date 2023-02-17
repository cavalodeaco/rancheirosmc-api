import dotenv from 'dotenv';
dotenv.config()

import app from "./src/api/app.js";

// Create table if not exists
import { dynamoDbClient } from './src/libs/ddb-client.js';
import { CreateTableCommand } from "@aws-sdk/client-dynamodb";

for (const table of ["user", "enroll"]) {
    const params = {
        TableName: `${process.env.TABLE_NAME}-${table}`,
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
    dynamoDbClient.send(new CreateTableCommand(params)).then((data) => {
        console.log(`Table ${table} Created `, data);
    }).catch((err) => {
        if (err.name === "ResourceInUseException") {
            console.log(`Table ${table} already exists `);
        } else {
            throw err;
        }
    });
}

// import dynamoose from "dynamoose";
// import { UserModelDynamo } from './src/model/user-model.js';
// import { EnrollModelDynamo } from './src/model/enroll-model.js';
// const { aws, Table } = dynamoose;
// aws.ddb.local(`http://${process.env.LOCAL_DYNAMO_URL}:${process.env.LOCAL_DYNAMO_PORT}`);
// const TableDynamo = new Table(process.env.TABLE_NAME, [UserModelDynamo, EnrollModelDynamo])

app.listen(3000, () => console.log('I hear you, on http://localhost:3000'))
