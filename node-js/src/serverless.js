const app = require("./api/app.js");
const serverless = require("serverless-http");

module.exports.handler = serverless(app);