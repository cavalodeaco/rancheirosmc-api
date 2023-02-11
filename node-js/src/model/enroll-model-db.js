import { dynamoDbDoc } from '../libs/ddb-doc.js';
import { PutCommand, GetCommand } from "@aws-sdk/lib-dynamodb";
import Ajv from 'ajv';
import { v4 as uuidv4 } from 'uuid';

const EnrollSchemaAjv = {
    type: "object",
    properties: {
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
    required: ["city", "motorcycle", "use", "terms"],
    additionalProperties: false
}

class EnrollModelDb {
    constructor(enrollData) {
        this.enrollData = enrollData;
        this.enroll = null;
    }

    async save() {
        const params = {
            TableName: `${process.env.TABLE_NAME}`,
            Item: {
                PK: 'enroll',
                SK: uuidv4(),
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
                }
            }
        };
        this.enroll = await dynamoDbDoc.send(new PutCommand(params));
        return this.enroll;
    }

    static validate(data) {
        const ajv = new Ajv({ allErrors: true })
        const valid = ajv.validate(EnrollSchemaAjv, data)
        if (!valid) {
            console.log(ajv.errors);
            const missingProperty = ajv.errors.map((error) => {
                return error.instancePath + '/' + error.params.missingProperty;
            });
            throw missingProperty;
        }
    }

    static async getById(id) {
        console.log("Model: getById");
        const params = {
            TableName: `${process.env.TABLE_NAME}`,
            Key: {
                PK: "enroll",
                SK: id,
            }
        };
        return await dynamoDbDoc.send(new GetCommand(params));
    }

    async getAll() {
        console.log("Model: getAll");
        const params = {
            TableName: `${process.env.TABLE_NAME}`,
            Key: {
                PK: "enroll"
            }
        };
        return await dynamoDbDoc.send(new GetCommand(params));
    }

    static async getAllPaginated(page, limit) {
        console.log("Model: getAllPaginated");
        const params = {
            TableName: `${process.env.TABLE_NAME}`,
            KeyConditionExpression: 'PK = :pk',
            ExpressionAttributeValues: {
                ':pk': 'enroll',
            },
            Limit: limit,
            ExclusiveStartKey: page,
        };
        const result = await dynamoDbDoc.send(new GetCommand(params));
        return result;
    }

    static async getAllByCityPaginated(city, page, limit) {
        console.log("Model: getAllByCityPaginated");
        const params = {
            TableName: `${process.env.TABLE_NAME}`,
            KeyConditionExpression: 'PK = :pk and begins_with(SK, :sk)',
            ExpressionAttributeValues: {
                ':pk': 'enroll',
                ':sk': city,
            },
            Limit: limit,
            ExclusiveStartKey: page,
        };
        const result = await dynamoDbDoc.send(new GetCommand(params));
        return result;
    }

    static async getAllByStatusPaginated(status, page, limit) {
        console.log("Model: getAllByStatusPaginated");
        const params = {
            TableName: `${process.env.TABLE_NAME}`,
            KeyConditionExpression: 'PK = :pk and begins_with(SK, :sk)',
            ExpressionAttributeValues: {
                ':pk': 'enroll',
                ':sk': status,
            },
            Limit: limit,
            ExclusiveStartKey: page,
        };
        const result = await dynamoDbDoc.send(new GetCommand(params));
        return result;
    }
};

export { EnrollModelDb };