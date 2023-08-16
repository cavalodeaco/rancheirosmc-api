const express = require("express");
const rescue = require("express-rescue");
const requestMiddleware = require("../middleware/request-middleware.js");
const photosRoutes = express.Router();
const { getAlbum } = require("../google-photos/index.js");

photosRoutes.post(
  "/",
  rescue(requestMiddleware),
  rescue(async (req, res) => {
    try {
      const results = await getAlbum(req.body.id);
      res.status(200).json(results);
    } catch (e) {
      res.status(500);
    }
  })
);

module.exports = { photosRoutes };
