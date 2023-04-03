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

const app = express();
app.use(bodyParser.json());
if (process.env.ENV === "production") {
  var allowlist = [
    "https://ppv.lordriders.com",
    "https://ppv-admin.lordriders.com",
  ];
  var corsOptionsDelegate = function (req, callback) {
    var corsOptions;
    if (allowlist.indexOf(req.header("Origin")) !== -1) {
      console.info("Allowing CORS for: " + req.header("Origin"));
      corsOptions = { origin: true }; // reflect (enable) the requested origin in the CORS response
    } else {
      console.info("Disabling CORS for: " + req.header("Origin"));
      corsOptions = { origin: false }; // disable CORS for this request
    }
    callback(null, corsOptions); // callback expects two parameters: error and options
  };
  app.use(cors(corsOptionsDelegate));
} else {
  app.use(cors());
}
app.use("/login", loginRoutes);
app.use("/enroll", enrollRoutes);
app.use("/report", reportRoutes);
app.use("/class", classRoutes);
app.use("/manager", managerRoutes);
app.use("/legacy", legacyRoutes);
app.use(errorMiddleware);

module.exports = app;
