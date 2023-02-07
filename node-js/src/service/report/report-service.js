import LoginService from '../login/login-service.js';

class ReportService {
    async getAll(data) {
        const service = new LoginService();
        try {
            const valid = await service.validateToken(data.access_token, data.id_token); // validate structure of data
            if (valid) {
                return { status: 200, data: "Valid token" };
            }
            throw { message: "Internal Server Error: getAll", status: 500 };
        } catch (err) {
            throw err;
        }
    }
}

export default ReportService;