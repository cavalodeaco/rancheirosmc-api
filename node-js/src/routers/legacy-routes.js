const LegacyController = require("../controllers/legacy-controller.js");
const express = require("express");
const rescue = require("express-rescue");
const corsMiddleware = require("../middleware/cors-middleware.js");
const logMiddleware = require("../middleware/log-middleware.js");
const JWTMiddleware = require("../middleware/jwt-middleware.js");

const legacyRoutes = express.Router();
const jwtMiddleware = new JWTMiddleware();

legacyRoutes.post(
  "/",
  rescue(logMiddleware),
  rescue(jwtMiddleware.validateToken),
  rescue(LegacyController.postEnroll),
  rescue(corsMiddleware)
);

module.exports = { legacyRoutes };
