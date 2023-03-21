import {EnrollModelDb as EnrollModel} from "../model/enroll-model-db.js";
import { UserModelDb as UserModel } from "../model/user-model-db.js";
import Ajv from 'ajv';

const GetEnrollSchema = {
    type: "object",
    properties: {
        filter: { type: "string" }
    },
    required: ["filter"],
    additionalProperties: false
}

class ReportService {
    async getEnrollById (id) {
        console.log("Service: getEnrollById");
        return { status: 200, data: await EnrollModel.getById(id)}
    }
    async getEnrolls (limit, page, data) {
        console.log("Service: getEnrolls");
        this.validateGetEnrolls(data);
        if (data.filter == "all")
            return { status: 200, data: await EnrollModel.get(limit, page)}
        else if (data.filter == "rancho")
            return { status: 200, data: await EnrollModel.getRancho(limit, page)}
        else if (data.filter == "curitiba")
            return { status: 200, data: await EnrollModel.getCuritiba(limit, page)}
        throw CreateError[400]({ message: `Invalid filter: ${data.filter}` });        
    }

    validateGetEnrolls(data) {
        // Validade main structure
        const ajv = new Ajv({ allErrors: true })
        const valid = ajv.validate(GetEnrollSchema, data)
        if (!valid) {
            const mp = ajv.errors.map((error) => {
                return error.params.missingProperty;
            });
            throw CreateError[400]({ message: `Missing property on body: ${mp}` });
        }
    }

    async getEnrollsByCity(city, limit, page) {
        console.log("Service: getByCity");
        return { status: 200, data: await EnrollModel.getByCity(city, limit, page)}
    }
    async getEnrollsByStatus(status, limit, page) {
        console.log("Service: getEnrollsByStatus");
        return { status: 200, data: await EnrollModel.getByStatus(status, limit, page)}
    }
    async getUsers (limit, page) {
        console.log("Service: getUsers");
        return { status: 200, data: await UserModel.get(limit, page)}
    }
    async getUserById (id) {
        console.log("Service: getUserById");
        return { status: 200, data: await UserModel.getById(id)}
    }
}

export default ReportService;