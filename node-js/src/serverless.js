const app = require("./api/app.js");
const serverless = require("serverless-http");

const handler = serverless(app);

module.exports = handler;
