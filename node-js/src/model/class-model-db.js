import { dynamoDbDoc } from '../libs/ddb-doc.js';
import { PutCommand, ScanCommand, GetCommand } from "@aws-sdk/lib-dynamodb";
import Ajv from 'ajv';
import CreateError from 'http-errors';

const ClassSchemaAjv = {
    type: "object",
    properties: {
        name: {type: "string"},
        city: { type: "string" },
        location: { type: "string" },
        date: { type: "string" },
    },
    required: ["name", "city", "location", "date"],
    additionalProperties: false
}

class ClassModelDb {
    constructor(classData) {
        this.classData = classData;
        this.classData.name = `PPV ${this.classData.date} (${this.classData.city})`
    }

    async save(admin_username) {
        console.log("ClassModelDb.save");

        // Validate Class
        ClassModelDb.validate(this.classData);
        const date = new Date();

        const params = {
            TableName: `${process.env.TABLE_NAME}-class`,
            Item: {
                name: this.classData.name, 
                city: this.classData.city, // PK
                location: this.classData.location,
                date: this.classData.date, // SK
                active: "true",
                created_at: `${date.toLocaleString("pt-BR")}:${date.getMilliseconds()}`,
                updated_at: `${date.toLocaleString("pt-BR")}:${date.getMilliseconds()}`,
                updated_by: admin_username
            }
        }
        // Check if class already exist
        const class_ = await this.getById({ city: this.classData.city, date: this.classData.date });
        if (class_) {
            console.log("Already exist!");
            throw CreateError[409]("Class already exist!");
        } else {
            console.log("Creating new class!");
            await dynamoDbDoc.send(new PutCommand(params));
            return "created";
        }
    }

    async getById(classId) {
        console.log("EnrollModel: getById");
        const params = {
            TableName: `${process.env.TABLE_NAME}-class`,
            Key: {
                ...classId
            }
        };
        const result = await dynamoDbDoc.send(new GetCommand(params))
        return result.Item;
    }

    static validate(data) {
        console.log("ClassModelDb.validate");
        const ajv = new Ajv({ allErrors: true })
        const valid = ajv.validate(ClassSchemaAjv, data)
        if (!valid) {
            const missingProperty = ajv.errors.map((error) => {
                return error.instancePath + '/' + error.params.missingProperty;
            });
            throw CreateError[400](`Missing property on class: ${missingProperty}`);
        }
    }

    static async get(limit, page) {
        console.log("ClassModelDb.get");
        const params = {
            TableName: `${process.env.TABLE_NAME}-class`,
            Limit: parseInt(limit),
            ExclusiveStartKey: page,
        };
        return ClassModelDb.scanParams(params);
    }

    static async scanParams(params) {
        const result = await dynamoDbDoc.send(new ScanCommand(params));
        return { Items: result.Items, page: result.LastEvaluatedKey };
    }
};

export { ClassModelDb };
