import ReportService from '../service/report-service.js';

class ReportController {
    async getEnrolls (req, res, next) {
        console.log("Controller: getEnrolls");
        try {
            const service = new ReportService();
            const {status, data} = await service.getEnrolls(req.body.limit, req.body.page);
            res.status(status).json({message:data});
        } catch (err) {
            next(err);
        }
    }

    async getEnrollById (req, res, next) {
        console.log("Controller: getEnrollById");
        try {
            const service = new ReportService();
            const {status, data} = await service.getEnrollById(req.params.id);
            res.status(status).json({message:data});
        } catch (err) {
            next(err);
        }
    }

    async getEnrollsByCity(req, res, next) {
        console.log("Controller: getEnrollsByCity");
        try {
            const service = new ReportService();
            const {status, data} = await service.getEnrollsByCity(req.params.city, req.body.limit, req.body.page);
            res.status(status).json({message:data});
        } catch (err) {
            next(err);
        }
    }

    async getEnrollsByStatus(req, res, next) {
        console.log("Controller: getEnrollsByStatus");
        try {
            const service = new ReportService();
            const {status, data} = await service.getEnrollsByStatus(req.params.status, req.body.limit, req.body.page);
            res.status(status).json({message:data});
        } catch (err) {
            next(err);
        }
    }

    async getUsers (req, res, next) {
        console.log("Controller: getUsers");
        try {
            const service = new ReportService();
            const {status, data} = await service.getUsers();
            res.status(status).json({message:data});
        } catch (err) {
            next(err);
        }
    }

    async getUserById (req, res, next) {
        console.log("Controller: getUserById");
        try {
            const service = new ReportService();
            const {status, data} = await service.getUserById(req.params.id);
            res.status(status).json({message:data});
        } catch (err) {
            next(err);
        }
    }
}

export default ReportController;