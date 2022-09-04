import { model } from "dynamoose";
import dynamoose from "dynamoose";
import Ajv from 'ajv';

const UserSchemaDynamo = new dynamoose.Schema({
    "id": String,
    "name": String,
    "email": String,
    "phone": String,
    "driverLicense": Object,
}, {
    "saveUnknown": [
        "driverLicense.*", // * allow one level and ** infinite levels.
    ],
    "timestamps": true // controls createdAt and updatedAt
});
const UserModelDynamo = model("User", UserSchemaDynamo);

const UserSchemaAjv = {
    type: "object",
    properties: {
        name: { type: "string" },
        email: { type: "string" },
        phone: { type: "string" },
        driverLicense: {
            type: "object",
            properties: {
                number: { type: "string" },
                date: { type: "string" }
            },
            required: ["number", "date"]
        }
    },
    required: ["name", "email", "phone", "driverLicense"],
    additionalProperties: false
}

class UserModel {

    constructor(userData) {
        this.user = new UserModelDynamo({
            "id": userData.driverLicense.number,
            "name": userData.name,
            "email": userData.email,
            "phone": userData.phone,
            "driverLicense": {
                "number": userData.driverLicense.number,
                "date": userData.driverLicense.date
            }
        });
    }

    get() {
        return this.user;
    }

    async save() {
        await this.user.save();
        // TODO: validate if user already exist
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

    static async find(id) {
        return await UserModelDynamo.get(id);
    }
};

export { UserModel, UserModelDynamo };