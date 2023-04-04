const ManagerController = require("../controllers/manager-controller.js");
const express = require("express");
const rescue = require("express-rescue");
const corsMiddleware = require("../middleware/cors-middleware.js");
const requestMiddleware = require("../middleware/log-middleware.js");
const JWTMiddleware = require("../middleware/jwt-middleware.js");
const responseMiddleware = require("../middleware/response-middleware.js");

const managerRoutes = express.Router();
const jwtMiddleware = new JWTMiddleware();

managerRoutes.post(
  "/call",
  rescue(requestMiddleware),
  rescue(jwtMiddleware.validateToken),
  rescue(ManagerController.postCall),
  rescue(responseMiddleware),
  rescue(corsMiddleware)
);
managerRoutes.post(
  "/confirm",
  rescue(requestMiddleware),
  rescue(jwtMiddleware.validateToken),
  rescue(ManagerController.postConfirm),
  rescue(responseMiddleware),
  rescue(corsMiddleware)
);
managerRoutes.post(
  "/certify",
  rescue(requestMiddleware),
  rescue(jwtMiddleware.validateToken),
  rescue(ManagerController.postCertify),
  rescue(responseMiddleware),
  rescue(corsMiddleware)
);
managerRoutes.post(
  "/miss",
  rescue(requestMiddleware),
  rescue(jwtMiddleware.validateToken),
  rescue(ManagerController.postMiss),
  rescue(responseMiddleware),
  rescue(corsMiddleware)
);
managerRoutes.post(
  "/drop",
  rescue(requestMiddleware),
  rescue(jwtMiddleware.validateToken),
  rescue(ManagerController.postDrop),
  rescue(responseMiddleware),
  rescue(corsMiddleware)
);
managerRoutes.post(
  "/ignore",
  rescue(requestMiddleware),
  rescue(jwtMiddleware.validateToken),
  rescue(ManagerController.postIgnore),
  rescue(responseMiddleware),
  rescue(corsMiddleware)
);
managerRoutes.post(
  "/wait",
  rescue(requestMiddleware),
  rescue(jwtMiddleware.validateToken),
  rescue(ManagerController.postWait),
  rescue(responseMiddleware),
  rescue(corsMiddleware)
);
managerRoutes.put(
  "/enroll",
  rescue(requestMiddleware),
  rescue(jwtMiddleware.validateToken),
  rescue(ManagerController.updateEnroll),
  rescue(responseMiddleware),
  rescue(corsMiddleware)
);
managerRoutes.put(
  "/class",
  rescue(requestMiddleware),
  rescue(jwtMiddleware.validateToken),
  rescue(ManagerController.updateClass),
  rescue(responseMiddleware),
  rescue(corsMiddleware)
);

module.exports = { managerRoutes };
