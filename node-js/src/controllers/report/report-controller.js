import ReportService from '../../service/report/report-service.js';

class ReportController {
    async getAllPaginated(req, res, next) {
        try {
            const service = new ReportService();
            const {status, data} = await service.getAllPaginated(req.params.page, req.params.limit);
            res.status(status).json({message:data});
        } catch (err) {
            next(err);
        }
    }

    async getAllByCityPaginated(req, res, next) {
        try {
            const service = new ReportService();
            const {status, data} = await service.getAllByCityPaginated(req.params.city, req.params.page, req.params.limit);
            res.status(status).json({message:data});
        } catch (err) {
            next(err);
        }
    }

    async getAllByStatusPaginated(req, res, next) {
        try {
            const service = new ReportService();
            const {status, data} = await service.getAllByStatusPaginated(req.params.status, req.params.page, req.params.limit);
            res.status(status).json({message:data});
        } catch (err) {
            next(err);
        }
    }
}

export default ReportController;