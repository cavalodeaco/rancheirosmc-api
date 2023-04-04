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
  rescue(corsMiddleware),
  rescue(responseMiddleware)
);
classRoutes.get(
  "/",
  rescue(requestMiddleware),
  rescue(jwtMiddleware.validateToken),
  rescue(ClassController.get),
  rescue(corsMiddleware),
  rescue(responseMiddleware)
);
classRoutes.get(
  "/download",
  rescue(requestMiddleware),
  rescue(jwtMiddleware.validateToken),
  rescue(ClassController.download),
  rescue(corsMiddleware),
  rescue(responseMiddleware)
);

module.exports = { classRoutes };
