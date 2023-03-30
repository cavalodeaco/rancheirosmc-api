import getIdToken from '../libs/get-tokens.js';
import ReportService from '../service/report-service.js';

class ReportController {
    async getEnrolls (req, res, next) {
        console.log("Controller: getEnrolls");
        console.log(req.headers.page, req.headers.limit, req.headers.filter);
        const id_token = getIdToken(req.headers);
        try {
            const service = new ReportService();
            const {status, data} = await service.getEnrolls(req.headers.limit, req.headers.page ? JSON.parse(req.headers.page) : undefined, id_token);
            return res.status(status).json({message:data});
        } catch (err) {
            next(err);
        }
    }

    async getUsers (req, res, next) {
        console.log("Controller: getUsers");
        try {
            const service = new ReportService();
            const {status, data} = await service.getUsers(req.headers.limit, req.headers.page ? JSON.parse(req.headers.page) : undefined);
            return res.status(status).json({message:data});
        } catch (err) {
            next(err);
        }
    }

}

export default ReportController;