import {EnrollModelDb as EnrollModel} from "../../model/enroll-model-db.js";

class ReportService {
    async getById (id) {
        console.log("Service: getById");
        return { status: 200, data: await EnrollModel.getById(id)}
    }
    async getAllPaginated(page, limit) {
        console.log("Service: getAllPaginated");
        return { status: 200, data: await EnrollModel.getAllPaginated(page, limit)}
    }
    async getAllByCityPaginated(city, page, limit) {
        console.log("Service: getAllByCityPaginated");
        return { status: 200, data: await EnrollModel.getAllByCityPaginated(city, page, limit)}
    }
    async getAllByStatusPaginated(status, page, limit) {
        console.log("Service: getAllByStatusPaginated");
        return { status: 200, data: await EnrollModel.getAllByStatusPaginated(status, page, limit)}
    }
}

export default ReportService;