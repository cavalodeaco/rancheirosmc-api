import { model } from "dynamoose";
import dynamoose from "dynamoose";
import Ajv from 'ajv';
import { EnrollModelDynamo } from "./enroll-model.js";

const UserSchemaDynamo = new dynamoose.Schema({
    "id": {
        type: String,
        hashKey: true,
      },
    "name": String,
    "email": String,
    "phone": String,
    "driverLicense": Object,
    "enroll": { 
        type: Array,
        schema: [EnrollModelDynamo],
        default: []
    }
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
        this.userData = userData;
    }

    get() {
        return this.user;
    }

    async save() {
        try {
            this.user = await UserModelDynamo.create({
                "id": this.userData.driverLicense.number,
                "name": this.userData.name,
                "email": this.userData.email,
                "phone": this.userData.phone,
                "driverLicense": {
                    "number": this.userData.driverLicense.number,
                    "date": this.userData.driverLicense.date
                }
            }); // do not save if id exists
        } catch (error) {
            this.user = await UserModel.find(this.userData.driverLicense.number);
        }
        return this.user;
    }

    async update(enrolls) {
        this.user = await UserModelDynamo.update({
            "id": this.userData.driverLicense.number,
            "enroll": enrolls
        });
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