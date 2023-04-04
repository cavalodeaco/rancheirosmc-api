const EnrollController = require("../controllers/enroll-controller.js");
const express = require("express");
const rescue = require("express-rescue");
const corsMiddleware = require("../middleware/cors-middleware.js");
const requestMiddleware = require("../middleware/log-middleware.js");
const responseMiddleware = require("../middleware/response-middleware.js");

const enrollRoutes = express.Router();

enrollRoutes.post(
  "/",
  rescue(requestMiddleware),
  rescue(EnrollController.postEnroll),
  rescue(responseMiddleware),
  rescue(corsMiddleware)
);

module.exports = { enrollRoutes };
