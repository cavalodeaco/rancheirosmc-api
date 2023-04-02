const { dynamoDbDoc } = require('../libs/ddb-doc.js');
const { ScanCommand, PutCommand, GetCommand, UpdateCommand, QueryCommand } = require("@aws-sdk/lib-dynamodb");
const Ajv = require('ajv');
const crypto = require('crypto');
const CreateError = require('http-errors');

const EnrollSchemaAjv = {
    type: "object",
    properties: {
        user: {
            type: "object",
            properties: {
                driver_license_UF: { type: "string" },
                driver_license: { type: "string" }
            },
            required: ["driver_license_UF", "driver_license"]
        },
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

const EnrollLegacySchemaAjv = {
    type: "object",
    properties: {
        user: {
            type: "object",
            properties: {
                driver_license_UF: { type: "string" },
                driver_license: { type: "string" }
            },
            required: ["driver_license_UF", "driver_license"]
        },
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
        class: { type: "string" },
        enroll_date: { type: "string" },
        enroll_status: { type: "string" },
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
    required: ["user", "city", "motorcycle", "use", "terms", "class", "enroll_date"],
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
        EnrollModelDb.validate(this.enrollData, EnrollSchemaAjv);

        const date = new Date();

        const params = {
            TableName: `${process.env.TABLE_NAME}-enroll`,
            Item: {
                city: this.enrollData.city.toLowerCase().trim(), // PK
                user: this.enrollData.user,
                motorcycle_brand: this.enrollData.motorcycle.brand.toLowerCase().trim() || "-",
                motorcycle_model: this.enrollData.motorcycle.model.toLowerCase().trim() || "-",
                motorcycle_use: this.enrollData.use.toLowerCase().trim()  || "-" ,
                terms: {
                    authorization: this.enrollData.terms.authorization || false,
                    responsibility: this.enrollData.terms.responsibility,
                    lgpd: this.enrollData.terms.lgpd
                },
                enroll_status: "waiting",
                enroll_date: `${date.toLocaleString("pt-BR")}:${date.getMilliseconds()}`, // SK
                updated_at: `${date.toLocaleString("pt-BR")}:${date.getMilliseconds()}`,
                updated_by: "user",
                class: "none"
            }
        };
        await dynamoDbDoc.send(new PutCommand(params));
        this.enroll = params.Item;
        return this.enroll;
    }

    static validate(data, schema) {
        console.log("EnrollModel: validate");
        const ajv = new Ajv({ allErrors: true })
        const valid = ajv.validate(schema, data)
        if (!valid) {
            const missingProperty = ajv.errors.map((error) => {
                return error.instancePath + '/' + error.params.missingProperty;
            });
            throw CreateError[400]({message:`Missing property on enroll: ${missingProperty}`});
        }
    }

    static async getById(enrollId) {
        console.log("EnrollModel: getById");
        const params = {
            TableName: `${process.env.TABLE_NAME}-enroll`,
            Key: {
                ...enrollId
            }
        };
        const result = await dynamoDbDoc.send(new GetCommand(params))
        return result.Item;
    }

    static async updateEnrollStatusPlusClass (enroll, admin_username) {
        console.log("EnrollModel: updateEnrollStatusPlusClass");
        const date = new Date();
        const params = {
            TableName: `${process.env.TABLE_NAME}-enroll`,
            Key: {
                city: enroll.city,
                enroll_date: enroll.enroll_date
            },
            ExpressionAttributeNames: { 
                "#class": "class" 
            },
            UpdateExpression: "set enroll_status = :enroll_status, updated_at = :updated_at, updated_by = :updated_by, #class = :class",
            ExpressionAttributeValues: {
                ":enroll_status": enroll.enroll_status,
                ":updated_at": `${date.toLocaleString("pt-BR")}:${date.getMilliseconds()}`,
                ":updated_by": admin_username,
                ":class": enroll.class
            }
        };
        const result = await dynamoDbDoc.send(new UpdateCommand(params));
        console.log("result updateEnrollStatusPlusClass", result);
        return result.Item;
    }

    static async updateEnrollStatus (enroll, admin_username) {
        console.log("EnrollModel: updateEnrollStatus");
        const date = new Date();
        const params = {
            TableName: `${process.env.TABLE_NAME}-enroll`,
            Key: {
                city: enroll.city,
                enroll_date: enroll.enroll_date
            },
            UpdateExpression: "set enroll_status = :enroll_status, updated_at = :updated_at, updated_by = :updated_by",
            ExpressionAttributeValues: {
                ":enroll_status": enroll.enroll_status,
                ":updated_at": `${date.toLocaleString("pt-BR")}:${date.getMilliseconds()}`,
                ":updated_by": admin_username,
            }
        };
        const result = await dynamoDbDoc.send(new UpdateCommand(params));
        console.log("result updateEnrollStatus", result);
        return result.Item;
    }

    async saveLegacy (userID, admin_username) {
        console.log("EnrollModel: saveLegacy");
        // Validate Enroll
        this.enrollData.user = userID;
        EnrollModelDb.validate(this.enrollData, EnrollLegacySchemaAjv);

        const date = new Date();

        const params = {
            TableName: `${process.env.TABLE_NAME}-enroll`,
            Item: {
                city: this.enrollData.city.toLowerCase().trim(), // PK
                user: this.enrollData.user,
                motorcycle_brand: this.enrollData.motorcycle.brand.toLowerCase().trim() || "-",
                motorcycle_model: this.enrollData.motorcycle.model.toLowerCase().trim() || "-",
                motorcycle_use: this.enrollData.use.toLowerCase().trim()  || "-" ,
                terms: {
                    authorization: this.enrollData.terms.authorization || false,
                    responsibility: this.enrollData.terms.responsibility,
                    lgpd: this.enrollData.terms.lgpd
                },
                enroll_status: this.enrollData.enroll_status,
                enroll_date: this.enrollData.enroll_date, // SK
                updated_at: `${date.toLocaleString("pt-BR")}:${date.getMilliseconds()}`,
                updated_by: admin_username,
                class: this.enrollData.class
            }
        };
        await dynamoDbDoc.send(new PutCommand(params));
        this.enroll = params.Item;
        return this.enroll;
    }

    static async get(limit, page, expression=undefined, attNames=undefined, attValues=undefined) {
        // https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Scan.html
        console.log("EnrollModel: get", expression);
        const params = {
            TableName: `${process.env.TABLE_NAME}-enroll`,
            Limit: parseInt(limit),
            ExclusiveStartKey: page,
        };
        if (expression) {
            params.FilterExpression = expression;            
        }
        if (attNames) {
            params.ExpressionAttributeNames = attNames;
        }
        if (attValues) {
            params.ExpressionAttributeValues = attValues;
        }
        if (page === undefined || page === 0) {
            delete params.ExclusiveStartKey;
        }
        return EnrollModelDb.scanParams(params);
    }

    static async getRancho(limit, page) {
        console.log("EnrollModel: getRancho");
        const params = {
            TableName: `${process.env.TABLE_NAME}-enroll`,
            Limit: parseInt(limit),
            ExclusiveStartKey: page,
            FilterExpression: "city <> curitiba"
        };
        if (page === undefined || page === 0) {
            delete params.ExclusiveStartKey;
        }
        return EnrollModelDb.scanParams(params);
    }

    static async getCuritiba(limit, page) {
        // https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Scan.html
        console.log("EnrollModel: getCuritiba");
        const params = {
            TableName: `${process.env.TABLE_NAME}-enroll`,
            Limit: parseInt(limit),
            ExclusiveStartKey: page,
            KeyConditionExpression: "city = :city",
            ExpressionAttributeValues: {
                ":city": "curitiba"
            }
        };
        if (page === undefined || page === 0) {
            delete params.ExclusiveStartKey;
        }
        const result = await dynamoDbDoc.send(new QueryCommand(params));
        return { Items: result.Items, page: result.LastEvaluatedKey };
    }

    static async scanParams(params) {
        const result = await dynamoDbDoc.send(new ScanCommand(params));
        // console.log(JSON.stringify(result, null, 2));
        return { Items: result.Items, page: result.LastEvaluatedKey };
    }
};

module.exports = { EnrollModelDb };