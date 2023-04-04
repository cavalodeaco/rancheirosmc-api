const ManagerController = require("../controllers/manager-controller.js");
const express = require("express");
const rescue = require("express-rescue");
const corsMiddleware = require("../middleware/cors-middleware.js");
const requestMiddleware = require("../middleware/request-middleware.js");
const JWTMiddleware = require("../middleware/jwt-middleware.js");
const responseMiddleware = require("../middleware/response-middleware.js");

const managerRoutes = express.Router();
const jwtMiddleware = new JWTMiddleware();

managerRoutes.post(
  "/call",
  rescue(requestMiddleware),
  rescue(jwtMiddleware.validateToken),
  rescue(ManagerController.postCall),
  rescue(corsMiddleware),
  rescue(responseMiddleware)
);
managerRoutes.post(
  "/confirm",
  rescue(requestMiddleware),
  rescue(jwtMiddleware.validateToken),
  rescue(ManagerController.postConfirm),
  rescue(corsMiddleware),
  rescue(responseMiddleware)
);
managerRoutes.post(
  "/certify",
  rescue(requestMiddleware),
  rescue(jwtMiddleware.validateToken),
  rescue(ManagerController.postCertify),
  rescue(corsMiddleware),
  rescue(responseMiddleware)
);
managerRoutes.post(
  "/miss",
  rescue(requestMiddleware),
  rescue(jwtMiddleware.validateToken),
  rescue(ManagerController.postMiss),
  rescue(corsMiddleware),
  rescue(responseMiddleware)
);
managerRoutes.post(
  "/drop",
  rescue(requestMiddleware),
  rescue(jwtMiddleware.validateToken),
  rescue(ManagerController.postDrop),
  rescue(corsMiddleware),
  rescue(responseMiddleware)
);
managerRoutes.post(
  "/ignore",
  rescue(requestMiddleware),
  rescue(jwtMiddleware.validateToken),
  rescue(ManagerController.postIgnore),
  rescue(corsMiddleware),
  rescue(responseMiddleware)
);
managerRoutes.post(
  "/wait",
  rescue(requestMiddleware),
  rescue(jwtMiddleware.validateToken),
  rescue(ManagerController.postWait),
  rescue(corsMiddleware),
  rescue(responseMiddleware)
);
managerRoutes.put(
  "/enroll",
  rescue(requestMiddleware),
  rescue(jwtMiddleware.validateToken),
  rescue(ManagerController.updateEnroll),
  rescue(corsMiddleware),
  rescue(responseMiddleware)
);
managerRoutes.put(
  "/class",
  rescue(requestMiddleware),
  rescue(jwtMiddleware.validateToken),
  rescue(ManagerController.updateClass),
  rescue(corsMiddleware),
  rescue(responseMiddleware)
);

module.exports = { managerRoutes };
