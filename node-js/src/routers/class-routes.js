const express = require("express");
const rescue = require("express-rescue");
const requestMiddleware = require("../middleware/request-middleware.js");
const ClassController = require("../controllers/class-controller.js");
const JWTMiddleware = require("../middleware/jwt-middleware.js");

const classRoutes = express.Router();
const jwtMiddleware = new JWTMiddleware();

classRoutes.post(
  "/",
  rescue(requestMiddleware),
  rescue(jwtMiddleware.validateToken),
  rescue(ClassController.post)
);
classRoutes.get(
  "/",
  rescue(requestMiddleware),
  rescue(jwtMiddleware.validateToken),
  rescue(ClassController.get)
);
classRoutes.get(
  "/download",
  rescue(requestMiddleware),
  rescue(jwtMiddleware.validateToken),
  rescue(ClassController.download)
);

module.exports = { classRoutes };
