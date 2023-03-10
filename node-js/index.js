import dotenv from 'dotenv';
dotenv.config()

import app from "./src/api/app.js";

// Create table if not exists
import { dynamoDbClient } from './src/libs/ddb-client.js';
import { CreateTableCommand } from "@aws-sdk/client-dynamodb";

const paramsUser = {
    TableName: `${process.env.TABLE_NAME}-user`,
    KeySchema: [
        { AttributeName: "driver_license_UF", KeyType: "HASH" },
        { AttributeName: "driver_license", KeyType: "RANGE" }
    ],
    AttributeDefinitions: [
        { AttributeName: "driver_license_UF", AttributeType: "S" },
        { AttributeName: "driver_license", AttributeType: "S" }
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

    AttributeDefinitions: [
        {
            AttributeName: "city",
            AttributeType: "S"
        },
        {
            AttributeName: "enroll_date",
            AttributeType: "S"
        },  
        {
            AttributeName: "enroll_status",
            AttributeType: "S"
        },
        {
            AttributeName: "motorcycle_brand",
            AttributeType: "S"
        },
        {
            AttributeName: "mototcycle_model",
            AttributeType: "S"
        },
        {
            AttributeName: "motorcycle_use",
            AttributeType: "S"
        }
    ],
    KeySchema: [
        {
            AttributeName: "city",
            KeyType: "HASH"
        },
        {
            AttributeName: "enroll_date",
            KeyType: "RANGE"
        }
    ],
    GlobalSecondaryIndexes: [
        {
            IndexName: "EnrollStatus",
            KeySchema: [
                {
                    AttributeName: "enroll_status",
                    KeyType: "HASH"
                }
            ],
            Projection: {
                ProjectionType: "ALL"
            },
            ProvisionedThroughput: {
                ReadCapacityUnits: "1",
                WriteCapacityUnits: "1"
            }
        },
        {
            IndexName: "MotorcycleBrand",
            KeySchema: [
                {
                    AttributeName: "motorcycle_brand",
                    KeyType: "HASH"
                }
            ],
            Projection: {
                NonKeyAttributes: [
                    "mototcycle_model",
                    "enroll_status",
                    "motorcycle_use"
                ],
                ProjectionType: "INCLUDE"
            },
            ProvisionedThroughput: {
                ReadCapacityUnits: "1",
                WriteCapacityUnits: "1"
            }
        },
        {
            IndexName: "MotorcycleUse",
            KeySchema: [
                {
                    AttributeName: "motorcycle_use",
                    KeyType: "HASH"
                }
            ],
            Projection: {
                NonKeyAttributes: [
                    "mototcycle_model",
                    "enroll_status",
                    "motorcycle_brand"
                ],
                ProjectionType: "INCLUDE"
            },
            ProvisionedThroughput: {
                ReadCapacityUnits: "1",
                WriteCapacityUnits: "1"
            }
        },
        {
            IndexName: "MotorcycleModel",
            KeySchema: [
                {
                    AttributeName: "mototcycle_model",
                    KeyType: "HASH"
                }
            ],
            Projection: {
                NonKeyAttributes: [
                    "mototcycle_use",
                    "enroll_status",
                    "motorcycle_brand"
                ],
                ProjectionType: "INCLUDE"
            },
            ProvisionedThroughput: {
                ReadCapacityUnits: "1",
                WriteCapacityUnits: "1"
            }
        }
    ],
    ProvisionedThroughput: {
        ReadCapacityUnits: "1",
        WriteCapacityUnits: "1"
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

const paramsClass = {
    TableName: `${process.env.TABLE_NAME}-class`,
    AttributeDefinitions: [
        {
            AttributeName: "city",
            AttributeType: "S"
        },  
        {
            AttributeName: "date",
            AttributeType: "S"
        },
        {
            AttributeName: "updated_by",
            AttributeType: "S"
        },
        {
            AttributeName: "active",
            AttributeType: "S"
        }
    ],
    KeySchema: [
        {
            AttributeName: "city",
            KeyType: "HASH"
        },
        {
            AttributeName: "date",
            KeyType: "RANGE"
        }
    ],
    GlobalSecondaryIndexes: [
        {
            IndexName: "Active",
            KeySchema: [
                {
                    AttributeName: "active",
                    KeyType: "HASH"
                }
            ],
            Projection: {
                ProjectionType: "ALL"
            },
            ProvisionedThroughput: {
                ReadCapacityUnits: "1",
                WriteCapacityUnits: "1"
            }
        },
        {
            IndexName: "UpdatedBy",
            KeySchema: [
                {
                    AttributeName: "updated_by",
                    KeyType: "HASH"
                }
            ],
            Projection: {
                ProjectionType: "ALL"
            },
            ProvisionedThroughput: {
                ReadCapacityUnits: "1",
                WriteCapacityUnits: "1"
            }
        },
    ],
    ProvisionedThroughput: {
        ReadCapacityUnits: "1",
        WriteCapacityUnits: "1"
    }
};
dynamoDbClient.send(new CreateTableCommand(paramsClass)).then((data) => {
    console.log(`Table class Created `, data);
}).catch((err) => {
    if (err.name === "ResourceInUseException") {
        console.log(`Table class already exists `);
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
