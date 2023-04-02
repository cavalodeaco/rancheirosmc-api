const express = require("express");
const rescue = require("express-rescue");
const corsMiddleware = require("../middleware/cors-middleware.js");
const logMiddleware = require("../middleware/log-middleware.js");
const ClassController = require("../controllers/class-controller.js");
const JWTMiddleware = require("../middleware/jwt-middleware.js");

const classRoutes = express.Router();
const jwtMiddleware = new JWTMiddleware();

classRoutes.post(
  "/",
  rescue(logMiddleware),
  rescue(jwtMiddleware.validateToken),
  rescue(ClassController.post),
  rescue(corsMiddleware)
);
classRoutes.get(
  "/",
  rescue(logMiddleware),
  rescue(jwtMiddleware.validateToken),
  rescue(ClassController.get),
  rescue(corsMiddleware)
);
classRoutes.get(
  "/download",
  rescue(logMiddleware),
  rescue(jwtMiddleware.validateToken),
  rescue(ClassController.download),
  rescue(corsMiddleware)
);

module.exports = { classRoutes };
