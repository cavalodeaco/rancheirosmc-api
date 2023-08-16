const cors = require("cors");
const express = require("express");
const bodyParser = require("body-parser");
const { loginRoutes } = require("../routers/login-routes.js");
const { enrollRoutes } = require("../routers/enroll-routes.js");
const errorMiddleware = require("../middleware/error-middleware.js");
const { reportRoutes } = require("../routers/report-routes.js");
const { classRoutes } = require("../routers/class-routes.js");
const { managerRoutes } = require("../routers/manager-routes.js");
const { legacyRoutes } = require("../routers/legacy-routes.js");
const { photosRoutes } = require("../routers/photos-routes.js");
const corsMiddleware = require("../middleware/cors-middleware.js");

const app = express();
app.use(bodyParser.json());
app.use(corsMiddleware);
app.use("/login", loginRoutes);
app.use("/enroll", enrollRoutes);
app.use("/report", reportRoutes);
app.use("/class", classRoutes);
app.use("/manager", managerRoutes);
app.use("/legacy", legacyRoutes);
app.use("/photos", photosRoutes);
app.use(errorMiddleware);

module.exports = app;
