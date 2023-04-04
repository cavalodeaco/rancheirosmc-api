const getIdToken = require("../libs/get-tokens.js");
const ReportService = require("../service/report-service.js");
const CreateError = require("http-errors");

class ReportController {
  async getEnrolls(req, res, next) {
    console.info("ReportController.getEnrolls");
    try {
      if (process.env.ENV !== "production")
        console.info(req.headers.page, req.headers.limit, req.headers.filter);
      const id_token = getIdToken(req.headers);
      const service = new ReportService();
      const { status, data } = await service.getEnrolls(
        req.headers.limit,
        req.headers.page ? JSON.parse(req.headers.page) : undefined,
        id_token
      );
      res.status(status).json({ message: data });
      return next();
    } catch (err) {
      throw CreateError[500]({
        message: "Error to get enrolls: " + JSON.stringify(err),
      });
    }
  }

  async getUsers(req, res, next) {
    console.info("ReportController.getUsers");
    try {
      const service = new ReportService();
      const { status, data } = await service.getUsers(
        req.headers.limit,
        req.headers.page ? JSON.parse(req.headers.page) : undefined
      );
      res.status(status).json({ message: data });
      return next();
    } catch (err) {
      throw CreateError[500]({
        message: "Error to get users: " + JSON.stringify(err),
      });
    }
  }
}

module.exports = ReportController;
