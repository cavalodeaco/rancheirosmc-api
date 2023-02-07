import { EnrollModel } from "../../model/enroll-model.js";

class ReportService {
    async getAllPaginated(page, limit) {
        return { status: 200, data: await EnrollModel.getAllPaginated(page, limit)}
    }
    async getAllByCityPaginated(city, page, limit) {
        return { status: 200, data: await EnrollModel.getAllByCityPaginated(city, page, limit)}
    }
    async getAllByStatusPaginated(status, page, limit) {
        return { status: 200, data: await EnrollModel.getAllByStatusPaginated(status, page, limit)}
    }
}

export default ReportService;