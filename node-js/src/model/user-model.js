import { model, Table as _Table } from "dynamoose";
import Ajv from 'ajv';
//import { v4 as uuidv4 } from 'uuid';

const UserDynamo = model("User", { "id": String, "name": String });
const UserSchema = {
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

    constructor(name) {
        this.user = new UserDynamo({
            "id": "1234",
            "name": name,
        });
        this.table = new _Table(process.env.TABLE_NAME, [UserDynamo]);
    }

    get() {
        return this.user;
    }

    async save() {
        await this.user.save();
    }

    static validate(data) {
        const ajv = new Ajv({allErrors:true})
        const valid = ajv.validate(UserSchema, data)
        if (!valid) {
            console.log(ajv.errors);
            const missingProperty = ajv.errors.map((error) => {
                return error.instancePath + '/' + error.params.missingProperty;
            });
            throw missingProperty;
        }
    }

    static async find(id) {
        return await UserDynamo.get(id);
    }
};

export default UserModel;