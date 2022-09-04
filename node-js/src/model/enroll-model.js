
import dynamoose from "dynamoose";
import { model } from "dynamoose";
import Ajv from 'ajv';
import { v4 as uuidv4 } from 'uuid';

const EnrollSchemaDynamo = new dynamoose.Schema({
    "id": {
        type: String,
        hashKey: true
    },
    "city": String,
    "motorcycle": Object,
    "use": String,
    "terms": Object,
    "class_date": {
        type: String,
        default: ""
    },
    "status": {
        type: String,
        default: "waiting"
    }
}, {
    "saveUnknown": [
        "motorcycle.*", // * allow one level and ** infinite levels.
        "terms.*"
    ],
    "timestamps": true // controls createdAt and updatedAt
});
const EnrollModelDynamo = model("Enroll", EnrollSchemaDynamo);

const EnrollSchemaAjv = {
    type: "object",
    properties: {
        city: { type: "string" },
        motorcycle: {
            type: "object",
            properties: {
                plate: { type: "string" },
                brand: { type: "string" },
                model: { type: "string" }
            },
            required: ["plate", "brand", "model"]
        },
        use: { type: "string" },
        terms: {
            type: "object",
            properties: {
                authorization: { type: "boolean" },
                responsability: { type: "boolean" },
                lgpd: { type: "boolean" }
            },
            required: ["authorization", "responsability", "lgpd"]
        }
    },
    required: ["city", "motorcycle", "use", "terms"],
    additionalProperties: false
}

class EnrollModel {

    constructor(enrollData) {
        this.enrollData = enrollData;
        this.enroll = null;
    }

    get() {
        return this.enroll;
    }

    async save() {
        this.enroll = await EnrollModelDynamo.create({
            "id": uuidv4(),
            "city": this.enrollData.city,
            "motorcycle": {
                "plate": this.enrollData.motorcycle.plate,
                "brand": this.enrollData.motorcycle.brand,
                "model": this.enrollData.motorcycle.model
            },
            "use": this.enrollData.use,
            "terms": {
                "authorization": this.enrollData.terms.authorization,
                "responsability": this.enrollData.terms.responsability,
                "lgpd": this.enrollData.terms.lgpd
            }
        });
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

    static async find(id) {
        return await EnrollModelDynamo.get(id);
    }
};

export { EnrollModel, EnrollModelDynamo };