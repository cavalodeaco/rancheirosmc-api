import { dynamoDbDoc } from '../libs/ddb-doc.js';
import { UpdateCommand, PutCommand, GetCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";
import Ajv from 'ajv';

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

    async save () {
        const params = {
            TableName: `${process.env.TABLE_NAME}`,
            Item: {
                PK: 'user',
                SK: this.userData.driverLicense,
                name: this.userData.name,
                email: this.userData.email,
                phone: this.userData.phone,
                driverLicense: this.userData.driverLicense,
                driverLicenseUF: this.userData.driverLicenseUF,
                enroll: []
            }
        }
        try {
            const result = await dynamoDbDoc.send(new PutCommand(params));
            this.user = params.Item
            return this.user;
        } catch (error) {
            console.log(error);
            console.log("Already exist finding it!");
            this.user = await UserModelDb.find(this.userData.driverLicense);
        }
    }

    static async find (id) {
        const params = {
            TableName: `${process.env.TABLE_NAME}`,
            Key: {
                PK: 'user',
                SK: id
            }
        }
        const result = await dynamoDbDoc.send(new GetCommand(params));
        return result.Item;
    }

    // update user adding the enrollment
    async update (enroll) {
        const params = {
            TableName: `${process.env.TABLE_NAME}`,
            Key: {
                PK: 'user',
                SK: this.user.SK
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
        const ajv = new Ajv({ allErrors: true })
        const valid = ajv.validate(UserSchemaAjv, data)
        if (!valid) {
            console.log(ajv.errors);
            const missingProperty = ajv.errors.map((error) => {
                return error.instancePath + '/' + error.params.missingProperty;
            });
            throw missingProperty;
        }
    }

    static async getAllUser () {
        const params = {
            TableName: `${process.env.TABLE_NAME}`,
            FilterExpression: "PK = :pk",
            ExpressionAttributeValues: {
                ":pk": "user"
            }
        }
        const result = await dynamoDbDoc.send(new ScanCommand(params));
        return result.Items;
    }
};

export {UserModelDb};
