import ReportService from '../service/report-service.js';

class ReportController {
    async getEnrolls (req, res, next) {
        console.log("Controller: getEnrolls");
        try {
            const service = new ReportService();
            const {status, data} = await service.getEnrolls();
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

    async getEnrollsPaginated(req, res, next) {
        console.log("Controller: getEnrollsPaginated");
        try {
            const service = new ReportService();
            const {status, data} = await service.getEnrollsPaginated(req.params.page, req.params.limit);
            res.status(status).json({message:data});
        } catch (err) {
            next(err);
        }
    }

    async getEnrollsByCityPaginated(req, res, next) {
        console.log("Controller: getEnrollsByCityPaginated");
        try {
            const service = new ReportService();
            const {status, data} = await service.getEnrollsByCityPaginated(req.params.city, req.params.page, req.params.limit);
            res.status(status).json({message:data});
        } catch (err) {
            next(err);
        }
    }

    async getEnrollsByStatusPaginated(req, res, next) {
        console.log("Controller: getAllByStatusPaginated");
        try {
            const service = new ReportService();
            const {status, data} = await service.getAllByStatusPaginated(req.params.status, req.params.page, req.params.limit);
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