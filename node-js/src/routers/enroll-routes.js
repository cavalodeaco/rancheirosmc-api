const EnrollController = require("../controllers/enroll-controller.js");
const express = require("express");
const rescue = require("express-rescue");
const corsMiddleware = require("../middleware/cors-middleware.js");
const requestMiddleware = require("../middleware/request-middleware.js");
const responseMiddleware = require("../middleware/response-middleware.js");

const enrollRoutes = express.Router();

enrollRoutes.post(
  "/",
  rescue(requestMiddleware),
  rescue(EnrollController.postEnroll),
  rescue(corsMiddleware),
  rescue(responseMiddleware)
);

module.exports = { enrollRoutes };
