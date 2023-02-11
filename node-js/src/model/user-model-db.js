import { dynamoDbDoc } from '../libs/ddb-doc.js';
import { UpdateCommand, PutCommand, GetCommand } from "@aws-sdk/lib-dynamodb";
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
                driverLicenseUF: this.userData.driverLicenseUF
            }
        }
        try {
            const result = await dynamoDbDoc.send(new PutCommand(params));
            this.user = result;
            console.log("User: ");
            console.log(this.user);
            console.log(result.Attributes);
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
    static async update (enroll) {
        const params = {
            TableName: `${process.env.TABLE_NAME}`,
            Key: {
                PK: 'user',
                SK: this.SK
            },
            UpdateExpression: "set enroll = :enroll",
            ExpressionAttributeValues: {
                ":enroll": enroll
            },
            ReturnValues: "UPDATED_NEW"
        }
        const result = await dynamoDbDoc.send(new UpdateCommand(params));
        this.user = result;
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
};

export {UserModelDb};
