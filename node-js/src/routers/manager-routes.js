const ManagerController = require("../controllers/manager-controller.js");
const express = require("express");
const rescue = require("express-rescue");
const requestMiddleware = require("../middleware/request-middleware.js");
const JWTMiddleware = require("../middleware/jwt-middleware.js");

const managerRoutes = express.Router();
const jwtMiddleware = new JWTMiddleware();

managerRoutes.post(
  "/call",
  rescue(requestMiddleware),
  rescue(jwtMiddleware.validateToken),
  rescue(ManagerController.postCall)
);
managerRoutes.post(
  "/confirm",
  rescue(requestMiddleware),
  rescue(jwtMiddleware.validateToken),
  rescue(ManagerController.postConfirm)
);
managerRoutes.post(
  "/certify",
  rescue(requestMiddleware),
  rescue(jwtMiddleware.validateToken),
  rescue(ManagerController.postCertify)
);
managerRoutes.post(
  "/miss",
  rescue(requestMiddleware),
  rescue(jwtMiddleware.validateToken),
  rescue(ManagerController.postMiss)
);
managerRoutes.post(
  "/drop",
  rescue(requestMiddleware),
  rescue(jwtMiddleware.validateToken),
  rescue(ManagerController.postDrop)
);
managerRoutes.post(
  "/ignore",
  rescue(requestMiddleware),
  rescue(jwtMiddleware.validateToken),
  rescue(ManagerController.postIgnore)
);
managerRoutes.post(
  "/wait",
  rescue(requestMiddleware),
  rescue(jwtMiddleware.validateToken),
  rescue(ManagerController.postWait)
);
managerRoutes.put(
  "/enroll",
  rescue(requestMiddleware),
  rescue(jwtMiddleware.validateToken),
  rescue(ManagerController.updateEnroll)
);
managerRoutes.put(
  "/class",
  rescue(requestMiddleware),
  rescue(jwtMiddleware.validateToken),
  rescue(ManagerController.updateClass)
);

module.exports = { managerRoutes };
