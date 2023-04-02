const LegacyService = require("../service/legacy-service.js");
const jwt = require("jsonwebtoken");

const LegacyController = {
  postEnroll: async (req, res, next) => {
    // get tokens from header
    const id_token =
      process.env.ENV == "local"
        ? JSON.parse(process.env.TOKENS)["id_token"]
        : req.headers.id_token;
    let decodedIdJwt = jwt.decode(id_token, { complete: true });
    if (!decodedIdJwt) {
      throw CreateError[401]({ message: "Not a valid Id JWT token" });
    }
    if (decodedIdJwt.payload["custom:manager"] !== "true") {
      throw CreateError[401]({ message: "Not a manager" });
    }
    const admin_username = decodedIdJwt.payload["preferred_username"];
    try {
      const service = new LegacyService();
      const enrollStatus = await service.enrollLegacy(req.body, admin_username);
      let status = 500;
      switch (enrollStatus) {
        case "enrolled":
          status = 201;
          break;
        case "waiting":
          status = 409;
          break;
      }
      return res.status(status).json({ message: enrollStatus });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = LegacyController;
