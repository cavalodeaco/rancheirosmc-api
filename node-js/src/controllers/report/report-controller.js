import ReportService from '../../service/report/report-service.js';

const ReportController = {
    getAll: async (req, res, next) => {
        try {
            const service = new ReportService();
            const {status, data} = await service.getAll(req.body);
            res.status(status).json({message:data});
        } catch (err) {
            next(err);
        }
    }
}

export default ReportController;