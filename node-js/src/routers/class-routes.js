const express = require("express");
const rescue = require("express-rescue");
const corsMiddleware = require("../middleware/cors-middleware.js");
const requestMiddleware = require("../middleware/request-middleware.js");
const responseMiddleware = require("../middleware/response-middleware.js");
const ClassController = require("../controllers/class-controller.js");
const JWTMiddleware = require("../middleware/jwt-middleware.js");

const classRoutes = express.Router();
const jwtMiddleware = new JWTMiddleware();

classRoutes.post(
  "/",
  rescue(requestMiddleware),
  rescue(jwtMiddleware.validateToken),
  rescue(ClassController.post),
  rescue(responseMiddleware),
  rescue(corsMiddleware)
);
classRoutes.get(
  "/",
  rescue(requestMiddleware),
  rescue(jwtMiddleware.validateToken),
  rescue(ClassController.get),
  rescue(responseMiddleware),
  rescue(corsMiddleware)
);
classRoutes.get(
  "/download",
  rescue(requestMiddleware),
  rescue(jwtMiddleware.validateToken),
  rescue(ClassController.download),
  rescue(responseMiddleware),
  rescue(corsMiddleware)
);

module.exports = { classRoutes };
