import { dynamoDbDoc } from '../libs/ddb-doc.js';
import { ScanCommand, PutCommand, GetCommand } from "@aws-sdk/lib-dynamodb";
import Ajv from 'ajv';
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';
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

    // encript the city
    static encryptCity(city) {
        return `${crypto.createHash('sha256').update(city).digest('hex')}`;
    }

    async save(userID) {
        console.log("EnrollModel: save");

        // Validate Enroll
        this.enrollData.user = userID;
        EnrollModelDb.validate(this.enrollData);

        const params = {
            TableName: `${process.env.TABLE_NAME}-enroll`,
            Item: {
                PK: `enroll-${uuidv4()}`,
                SK: EnrollModelDb.encryptCity(this.enrollData.city),
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
                status: "waiting",
                createdAt: new Date().toLocaleString("pt-BR"),
                updatedAt: new Date().toLocaleString("pt-BR")
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

    static async getById(enrollId) {
        console.log("EnrollModel: getById");
        const params = {
            TableName: `${process.env.TABLE_NAME}-enroll`,
            Key: {
                PK: enrollId.id,
                SK: EnrollModelDb.encryptCity(enrollId.city)
            }
        };
        const result = await dynamoDbDoc.send(new GetCommand(params))
        return result.Item;
    }

    static async get (limit, page) {
        // https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Scan.html
        console.log("EnrollModel: get");
        const params = {
            TableName: `${process.env.TABLE_NAME}-enroll`,
            Limit: limit,
            ExclusiveStartKey: page,
        };
        if (page === undefined || page === 0) {
            delete params.ExclusiveStartKey;
        }
        return EnrollModelDb.scanParams(params);
    }

    static async getByCity(city, limit, page) {
        console.log("EnrollModel: getByCity");
        const params = {
            TableName: `${process.env.TABLE_NAME}-enroll`,
            FilterExpression: 'city = :city',
            ExpressionAttributeValues: {
                ':city': city,
            },
            Limit: limit,
            ExclusiveStartKey: page,
        };
        return EnrollModelDb.scanParams(params);
    }

    static async getByStatus(status, limit, page) {
        console.log("EnrollModel: getByStatus");
        const params = {
            TableName: `${process.env.TABLE_NAME}-enroll`,
            FilterExpression: '#enroll_status = :status',
            ExpressionAttributeValues: {
                ':status': status,
            },
            ExpressionAttributeNames: {
                "#enroll_status": "status"
            },
            Limit: limit,
            ExclusiveStartKey: page,
        };
        return EnrollModelDb.scanParams(params);
    }

    static async scanParams (params) {
        const result = await dynamoDbDoc.send(new ScanCommand(params));
        return {Items: result.Items, page: result.LastEvaluatedKey};
    }
};

export { EnrollModelDb };