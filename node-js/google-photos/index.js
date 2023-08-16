const serverless = require("serverless-http");
const express = require("express");
const bodyParser = require("body-parser");
const { getAlbum } = require("./google-photos");
const app = express();
app.use(bodyParser.json());

app.use(function (req, res, next) {
  console.info("Cors");
  const origin = req.header("Origin");
  console.log(origin);
  var allowlist = [
    "https://www.rancheirosmc.com.br",
    "https://rancheirosmc.com.br",
    "https://mpv.rancheirosmc.com.br",
    "https://admin.rancheirosmc.com.br",
  ];
  if (process.env.ENV === "production") {
    if (allowlist.indexOf(origin) !== -1) {
      res.setHeader("Access-Control-Allow-Origin", origin);
      res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
      );
      res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
      res.header("Access-Control-Allow-Credentials", "false");
      next();
    } else {
      throw new Error("CORS Error: invalid origin");
    }
  } else {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.header("Access-Control-Allow-Credentials", "false");
  }
  next();
});

app.post("/", async (req, res) => {
  try {
    console.log(req.body.id);
    const results = await getAlbum(req.body.id);
    res.json(results);
  } catch (e) {
    res.status(500);
  }
});

module.exports.handler = serverless(app);
// app.listen(3001, () => console.info("I hear you, on http://localhost:3001")); // local
