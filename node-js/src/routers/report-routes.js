const express = require("express");
const rescue = require("express-rescue");
const ReportController = require("../controllers/report-controller.js");
const JWTMiddleware = require("../middleware/jwt-middleware.js");
const requestMiddleware = require("../middleware/log-middleware.js");
const corsMiddleware = require("../middleware/cors-middleware.js");
const responseMiddleware = require("../middleware/response-middleware.js");

const reportRoutes = express.Router();
const jwtMiddleware = new JWTMiddleware();
const repControl = new ReportController();

reportRoutes.get(
  "/enroll",
  rescue(requestMiddleware),
  rescue(jwtMiddleware.validateToken),
  rescue(repControl.getEnrolls),
  rescue(responseMiddleware),
  rescue(corsMiddleware)
);
reportRoutes.get(
  "/user",
  rescue(requestMiddleware),
  rescue(jwtMiddleware.validateToken),
  rescue(repControl.getUsers),
  rescue(responseMiddleware),
  rescue(corsMiddleware)
);

module.exports = { reportRoutes };
