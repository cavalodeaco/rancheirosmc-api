import { dynamoDbDoc } from '../libs/ddb-doc.js';
import { UpdateCommand, PutCommand, GetCommand, ScanCommand, ExecuteStatementCommand } from "@aws-sdk/lib-dynamodb";
import Ajv from 'ajv';
import CreateError from 'http-errors';
import crypto from 'crypto';

const UserSchemaAjv = {
    type: "object",
    properties: {
        name: { type: "string" },
        email: { type: "string" },
        phone: { type: "string" },
        driverLicense: { type: "string" },
        driverLicenseUF: { type: "string" }
    },
    required: ["name", "email", "phone", "driverLicense", "driverLicenseUF"],
    additionalProperties: false
}

class UserModelDb {
    constructor(userData) {
        this.userData = userData;
        this.user = null;
    }

    // encript the user id using modulo to 200 in order to better partition key distribution
    static encryptDriverLicense(id) {
        return `user-${crypto.createHash('sha256').update(`${Number(id) % 200}`).digest('hex')}`;
    }

    async save() {
        console.log("UserModelDb.save");

        // Validate User
        UserModelDb.validate(this.userData);
        const date = new Date();

        const params = {
            TableName: `${process.env.TABLE_NAME}-user`,
            Item: {
                name: this.userData.name,
                email: this.userData.email,
                phone: this.userData.phone,
                driver_license: this.userData.driverLicense, // SK
                driver_license_UF: this.userData.driverLicenseUF, // PK
                enroll: [],
                created_at: `${date.toLocaleString("pt-BR")}:${date.getMilliseconds()}`,
                updated_at: `${date.toLocaleString("pt-BR")}:${date.getMilliseconds()}`,
                updated_by: "user"
            }
        }
        // Check if user already exist
        const user = await UserModelDb.getById({driver_license:this.userData.driverLicense, driver_license_UF:this.userData.driverLicenseUF} );
        if (user) {
            console.log("Already exist!");
            this.user = user;
            return this.user;
        } else {
            console.log("Creating new user!");
            const result = await dynamoDbDoc.send(new PutCommand(params));
            this.user = params.Item
            return this.user;
        }
    }

    // update user adding the enrollment
    async update(enroll) {
        console.log("UserModelDb.update");
        const params = {
            TableName: `${process.env.TABLE_NAME}-user`,
            Key: {
                driver_license: this.userData.driverLicense,
                driver_license_UF: this.userData.driverLicenseUF,
            },
            UpdateExpression: "set enroll = :enroll",
            ExpressionAttributeValues: {
                ":enroll": enroll
            },
        }
        const result = await dynamoDbDoc.send(new UpdateCommand(params));
        this.user.enroll = enroll;
        return this.user;
    }

    static validate(data) {
        console.log("UserModelDb.validate");
        const ajv = new Ajv({ allErrors: true })
        const valid = ajv.validate(UserSchemaAjv, data)
        if (!valid) {
            const missingProperty = ajv.errors.map((error) => {
                return error.instancePath + '/' + error.params.missingProperty;
            });
            throw CreateError[400](`Missing property on user: ${missingProperty}`);
        }
    }

    static async get (limit, page) {
        console.log("UserModelDb.get");
        const params = {
            TableName: `${process.env.TABLE_NAME}-user`,
            Limit: parseInt(limit),
            ExclusiveStartKey: page,
        };
        return UserModelDb.scanParams(params);
    }

    static async getById(ids) {
        console.log("UserModelDb.getById");
        const params = {
            TableName: `${process.env.TABLE_NAME}-user`,
            Key: {
                ...ids
            }
        }
        const result = await dynamoDbDoc.send(new GetCommand(params));
        return result.Item;
    }

    static async scanParams(params) {
        const result = await dynamoDbDoc.send(new ScanCommand(params));
        return { Items: result.Items, page: result.LastEvaluatedKey };
    }
};

export { UserModelDb };
