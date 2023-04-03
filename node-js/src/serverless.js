const app = require("./api/app.js");
const serverless = require("serverless-http");

exports.handler = serverless(app);
