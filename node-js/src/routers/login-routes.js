const express = require("express");
const rescue = require("express-rescue");
const LoginController = require("../controllers/login-controller.js");
const corsMiddleware = require("../middleware/cors-middleware.js");
const requestMiddleware = require("../middleware/request-middleware.js");
const responseMiddleware = require("../middleware/response-middleware.js");

const loginRoutes = express.Router();

loginRoutes.post(
  "/",
  rescue(requestMiddleware),
  rescue(LoginController.doLogin),
  rescue(responseMiddleware),
  rescue(corsMiddleware)
);

module.exports = { loginRoutes };
