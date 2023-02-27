import {EnrollModelDb as EnrollModel} from "../model/enroll-model-db.js";
import { UserModelDb as UserModel } from "../model/user-model-db.js";

class ReportService {
    async getEnrollById (id) {
        console.log("Service: getEnrollById");
        return { status: 200, data: await EnrollModel.getById(id)}
    }
    async getEnrolls (limit, page) {
        console.log("Service: getEnrolls");
        return { status: 200, data: await EnrollModel.get(limit, page)}
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