const EnrollController = require("../controllers/enroll-controller.js");
const express = require("express");
const rescue = require("express-rescue");
const requestMiddleware = require("../middleware/request-middleware.js");

const enrollRoutes = express.Router();

enrollRoutes.post(
  "/",
  rescue(requestMiddleware),
  rescue(EnrollController.postEnroll)
);

module.exports = { enrollRoutes };
