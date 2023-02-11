
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
                "brand": this.enrollData.motorcycle.brand,
                "model": this.enrollData.motorcycle.model
            },
            "use": this.enrollData.use,
            "terms": {
                "authorization": this.enrollData.terms.authorization || false,
                "responsibility": this.enrollData.terms.responsibility,
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
        console.log("Model: find");
        return await EnrollModelDynamo.get(id);
    }

    static async getById (id) {
        console.log("Model: getById");
        return await EnrollModelDynamo.get(id);
    }

    // get all enrollments paginated
    static async getAllPaginated(page, limit) {
        console.log("Model: getAllPaginated");
        try {
            return await EnrollModelDynamo.scan(); //.limit(limit).startAt(page).exec();
        } catch (error) {
            if (error.code === 'TypeError' && error.message === 'Cannot read properties of undefined (reading \'0\')') {
                throw { status: 404, message: 'No enrollments found' };
            }
        }
    }

    // get all enrollments by city paginated
    static async getAllByCityPaginated(city, page, limit) {
        console.log("Model: getAllByCityPaginated");
        try {
            return await EnrollModelDynamo.query('city').eq(city).limit(limit).startAt(page).exec();
        } catch (error) {
            if (error.code === 'TypeError' && error.message === 'Cannot read properties of undefined (reading \'0\')') {
                throw { status: 404, message: 'No enrollments found' };
            }
        }
    }

    // get all enrollments by status paginated
    static async getAllByStatusPaginated(status, page, limit) {
        console.log("Model: getAllByStatusPaginated");
        try {
            return await EnrollModelDynamo.query('status').eq(status).limit(limit).startAt(page).exec();
        } catch (error) {
            if (error.code === 'TypeError' && error.message === 'Cannot read properties of undefined (reading \'0\')') {
                throw { status: 404, message: 'No enrollments found' };
            }
        }
    }
};

export { EnrollModel, EnrollModelDynamo };