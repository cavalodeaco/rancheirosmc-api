const LegacyController = require("../controllers/legacy-controller.js");
const express = require("express");
const rescue = require("express-rescue");
const corsMiddleware = require("../middleware/cors-middleware.js");
const requestMiddleware = require("../middleware/request-middleware.js");
const JWTMiddleware = require("../middleware/jwt-middleware.js");
const responseMiddleware = require("../middleware/response-middleware.js");

const legacyRoutes = express.Router();
const jwtMiddleware = new JWTMiddleware();

legacyRoutes.post(
  "/",
  rescue(requestMiddleware),
  rescue(jwtMiddleware.validateToken),
  rescue(LegacyController.postEnroll),
  rescue(responseMiddleware),
  rescue(corsMiddleware)
);

module.exports = { legacyRoutes };
