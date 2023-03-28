import {EnrollModelDb as EnrollModel} from "../model/enroll-model-db.js";
import { UserModelDb as UserModel } from "../model/user-model-db.js";
import Ajv from 'ajv';
import CreateError from 'http-errors';

class ReportService {
    async getEnrolls (limit, page, filter) {
        console.log("Service: getEnrolls");
        if (filter == "all")
            return { status: 200, data: await EnrollModel.get(limit, page)}
        else if (filter == "rancho")
            return { status: 200, data: await EnrollModel.getRancho(limit, page)}
        else if (filter == "curitiba")
            return { status: 200, data: await EnrollModel.getCuritiba(limit, page)}
        throw CreateError[400]({ message: `Invalid filter ${filter}` });
    }
    async getUsers (limit, page) {
        console.log("Service: getUsers");
        return { status: 200, data: await UserModel.get(limit, page)}
    }
}

export default ReportService;