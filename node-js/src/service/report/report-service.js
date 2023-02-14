import {EnrollModelDb as EnrollModel} from "../../model/enroll-model-db.js";
import { UserModelDb as UserModel } from "../../model/user-model-db.js";

class ReportService {
    async getById (id) {
        console.log("Service: getById");
        return { status: 200, data: await EnrollModel.getById(id)}
    }
    async getEnrolls () {
        console.log("Service: getEnrolls");
        return { status: 200, data: await EnrollModel.getAll()}
    }
    async getEnrollsPaginated(page, limit) {
        console.log("Service: getEnrollsPaginated");
        return { status: 200, data: await EnrollModel.getAllPaginated(page, limit)}
    }
    async getEnrollsByCityPaginated(city, page, limit) {
        console.log("Service: getEnrollsByCityPaginated");
        return { status: 200, data: await EnrollModel.getAllByCityPaginated(city, page, limit)}
    }
    async getEnrollsByStatusPaginated(status, page, limit) {
        console.log("Service: getEnrollsByStatusPaginated");
        return { status: 200, data: await EnrollModel.getAllByStatusPaginated(status, page, limit)}
    }
    async getUsers () {
        console.log("Service: getUsers");
        return { status: 200, data: await UserModel.getAllUser()}
    }
    async getUserById (id) {
        console.log("Service: getUserById");
        return { status: 200, data: await UserModel.getById(id)}
    }
}

export default ReportService;