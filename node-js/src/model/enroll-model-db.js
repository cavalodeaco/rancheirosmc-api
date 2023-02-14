import { dynamoDbDoc } from '../libs/ddb-doc.js';
import { ScanCommand, PutCommand, GetCommand } from "@aws-sdk/lib-dynamodb";
import Ajv from 'ajv';
import { v4 as uuidv4 } from 'uuid';
import CreateError from 'http-errors';

const EnrollSchemaAjv = {
    type: "object",
    properties: {
        user: { type: "string" },
        city: { type: "string" },
        motorcycle: {
            type: "object",
            properties: {
                brand: { type: "string" },
                model: { type: "string" }
            },
            required: ["brand", "model"]
        },
        use: { type: "string" },
        terms: {
            type: "object",
            properties: {
                authorization: { type: "boolean" },
                responsibility: { type: "boolean" },
                lgpd: { type: "boolean" }
            },
            required: ["responsibility", "lgpd"]
        }
    },
    required: ["user", "city", "motorcycle", "use", "terms"],
    additionalProperties: false
}

class EnrollModelDb {
    constructor(enrollData) {
        this.enrollData = enrollData;
        this.enroll = null;
    }

    async save(userID) {
        console.log("EnrollModel: save");

        // Validate Enroll
        this.enrollData.user = userID;
        EnrollModelDb.validate(this.enrollData);

        const params = {
            TableName: `${process.env.TABLE_NAME}`,
            Item: {
                PK: 'enroll',
                SK: uuidv4(),
                user: this.enrollData.user,
                city: this.enrollData.city,
                motorcycle: {
                    brand: this.enrollData.motorcycle.brand,
                    model: this.enrollData.motorcycle.model
                },
                use: this.enrollData.use,
                terms: {
                    authorization: this.enrollData.terms.authorization || false,
                    responsibility: this.enrollData.terms.responsibility,
                    lgpd: this.enrollData.terms.lgpd
                },
                status: "waiting"
            }
        };
        await dynamoDbDoc.send(new PutCommand(params));
        this.enroll = params.Item;
        return this.enroll;
    }

    static validate(data) {
        console.log("EnrollModel: validate");
        const ajv = new Ajv({ allErrors: true })
        const valid = ajv.validate(EnrollSchemaAjv, data)
        if (!valid) {
            const missingProperty = ajv.errors.map((error) => {
                return error.instancePath + '/' + error.params.missingProperty;
            });
            throw CreateError[400](`Missing property on enroll: ${missingProperty}`);
        }
    }

    static async getById(id) {
        console.log("EnrollModel: getById");
        const params = {
            TableName: `${process.env.TABLE_NAME}`,
            Key: {
                PK: "enroll",
                SK: id,
            }
        };
        const result = await dynamoDbDoc.send(new GetCommand(params))
        return result.Item;
    }

    static async find(id) {
        console.log("EnrollModel: find");
        const params = {
            TableName: `${process.env.TABLE_NAME}`,
            Key: {
                PK: "enroll",
                SK: id,
            }
        };
        const result = await dynamoDbDoc.send(new GetCommand(params))
        return result.Item;
    }

    static async getAll () {
        console.log("EnrollModel: getAll");
        const params = {
            TableName: `${process.env.TABLE_NAME}`,
            FilterExpression: "PK = :pk",
            ExpressionAttributeValues: {
                ':pk': 'enroll',
            },
        };
        const result = await dynamoDbDoc.send(new ScanCommand(params));
        return result.Items;
    }

    static async getAllPaginated(page, limit) {
        console.log("EnrollModel: getAllPaginated");
        const params = {
            TableName: `${process.env.TABLE_NAME}`,
            FilterExpression: 'PK = :pk',
            ExpressionAttributeValues: {
                ':pk': 'enroll',
            },
            Limit: limit,
            ExclusiveStartKey: page,
        };
        const result = await dynamoDbDoc.send(new ScanCommand(params));
        return result.Items;
    }

    static async getAllByCityPaginated(city, page, limit) {
        console.log("EnrollModel: getAllByCityPaginated");
        const params = {
            TableName: `${process.env.TABLE_NAME}`,
            FilterExpression: 'PK = :pk and begins_with(SK, :sk)',
            ExpressionAttributeValues: {
                ':pk': 'enroll',
                ':sk': city,
            },
            Limit: limit,
            ExclusiveStartKey: page,
        };
        const result = await dynamoDbDoc.send(new ScanCommand(params));
        return result.Items;
    }

    static async getAllByStatusPaginated(status, page, limit) {
        console.log("EnrollModel: getAllByStatusPaginated");
        const params = {
            TableName: `${process.env.TABLE_NAME}`,
            FilterExpression: 'PK = :pk and begins_with(SK, :sk)',
            ExpressionAttributeValues: {
                ':pk': 'enroll',
                ':sk': status,
            },
            Limit: limit,
            ExclusiveStartKey: page,
        };
        const result = await dynamoDbDoc.send(new ScanCommand(params));
        return result.Items;
    }
};

export { EnrollModelDb };