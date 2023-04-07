const express = require("express");
const rescue = require("express-rescue");
const LoginController = require("../controllers/login-controller.js");
const requestMiddleware = require("../middleware/request-middleware.js");

const loginRoutes = express.Router();

loginRoutes.post(
  "/",
  rescue(requestMiddleware),
  rescue(LoginController.doLogin)
);

module.exports = { loginRoutes };
