import LoginService from '../login/login-service.js';

class ReportService {
    async getAll(data) {
        return { status: 200, data: "ReportService.getAll"}
    }
}

export default ReportService;