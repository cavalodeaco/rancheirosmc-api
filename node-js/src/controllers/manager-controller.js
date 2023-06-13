const ManagerService = require("../service/manager-service.js");
const jwt = require("jsonwebtoken");
const CreateError = require("http-errors");

const ManagerController = {
  updateClass: async (req, res, next) => {
    console.info("ManagerController.updateClass");
    try {
      // get tokens from header
      const id_token =
        process.env.ENV == "local"
          ? JSON.parse(process.env.TOKENS)["id_token"]
          : req.headers.id_token;
      let decodedIdJwt = jwt.decode(id_token, { complete: true });
      if (!decodedIdJwt) {
        throw CreateError[401]({ message: "Not a valid Id JWT token" });
      }
      if (
        decodedIdJwt.payload["custom:manager"] !== "true" &&
        decodedIdJwt.payload["custom:caller"] !== "true"
      ) {
        throw CreateError[401]({ message: "Not a manager a caller" });
      }
      const admin_username = decodedIdJwt.payload["preferred_username"];
      const service = new ManagerService();
      await service.updateClass(req.body, admin_username);
      console.info("response: ", 204, "Class updated");
      return res.status(204).json({ message: "Class updated" });
    } catch (err) {
      throw CreateError[500]({
        message: "Error to update class: " + JSON.stringify(err),
      });
    }
  },
  updateEnroll: async (req, res, next) => {
    console.info("ManagerController.updateEnroll");
    try {
      // get tokens from header
      const id_token =
        process.env.ENV == "local"
          ? JSON.parse(process.env.TOKENS)["id_token"]
          : req.headers.id_token;
      let decodedIdJwt = jwt.decode(id_token, { complete: true });
      if (!decodedIdJwt) {
        throw CreateError[401]({ message: "Not a valid Id JWT token" });
      }
      if (
        decodedIdJwt.payload["custom:manager"] !== "true" &&
        decodedIdJwt.payload["custom:caller"] !== "true" &&
        decodedIdJwt.payload["custom:posclass"] !== "true"
      ) {
        throw CreateError[401]({ message: "Not a manager a caller/posclass" });
      }
      const admin_username = decodedIdJwt.payload["preferred_username"];
      const service = new ManagerService();
      await service.updateEnroll(req.body, admin_username);
      console.info("response: ", 204, "Enroll updated");
      return res.status(204).json({ message: "Enroll updated" });
    } catch (err) {
      throw CreateError[500]({
        message: "Error to update enroll: " + JSON.stringify(err),
      });
    }
  },
  postCall: async (req, res, next) => {
    console.info("ManagerController.postCall");
    try {
      // get tokens from header
      const id_token =
        process.env.ENV == "local"
          ? JSON.parse(process.env.TOKENS)["id_token"]
          : req.headers.id_token;
      let decodedIdJwt = jwt.decode(id_token, { complete: true });
      if (!decodedIdJwt) {
        throw CreateError[401]({ message: "Not a valid Id JWT token" });
      }
      if (
        decodedIdJwt.payload["custom:manager"] !== "true" &&
        decodedIdJwt.payload["custom:caller"] !== "true"
      ) {
        throw CreateError[401]({ message: "Not a manager a caller" });
      }
      const admin_username = decodedIdJwt.payload["preferred_username"];
      const service = new ManagerService();
      const message = await service.call2Class(req.body, admin_username);
      console.info("message: ", message);
      return res.status(200).json(message);
    } catch (err) {
      throw CreateError[500]({
        message: "Error to call class: " + JSON.stringify(err),
      });
    }
  },
  postConfirm: async (req, res, next) => {
    console.info("ManagerController.postConfirm");
    // try {
    // get tokens from header
    const id_token =
      process.env.ENV == "local"
        ? JSON.parse(process.env.TOKENS)["id_token"]
        : req.headers.id_token;
    let decodedIdJwt = jwt.decode(id_token, { complete: true });
    if (!decodedIdJwt) {
      throw CreateError[401]({ message: "Not a valid Id JWT token" });
    }
    if (
      decodedIdJwt.payload["custom:manager"] !== "true" &&
      decodedIdJwt.payload["custom:caller"] !== "true"
    ) {
      throw CreateError[401]({ message: "Not a manager or a caller" });
    }
    const admin_username = decodedIdJwt.payload["preferred_username"];
    const service = new ManagerService();
    const message = await service.action2Class(
      req.body,
      admin_username,
      "confirm"
    );
    console.info("message: ", message);
    return res.status(200).json(message);
    // } catch (err) {
    //   throw CreateError[500]({
    //     message: "Error to confirm class: " + JSON.stringify(err),
    //   });
    // }
  },
  postCertify: async (req, res, next) => {
    console.info("ManagerController.postCertify");
    try {
      // get tokens from header
      const id_token =
        process.env.ENV == "local"
          ? JSON.parse(process.env.TOKENS)["id_token"]
          : req.headers.id_token;
      let decodedIdJwt = jwt.decode(id_token, { complete: true });
      if (!decodedIdJwt) {
        throw CreateError[401]({ message: "Not a valid Id JWT token" });
      }
      if (
        decodedIdJwt.payload["custom:manager"] !== "true" &&
        decodedIdJwt.payload["custom:caller"] !== "true"
      ) {
        throw CreateError[401]({
          message: "Not a manager or after class manager",
        });
      }
      const admin_username = decodedIdJwt.payload["preferred_username"];
      const service = new ManagerService();
      const message = await service.action2Class(
        req.body,
        admin_username,
        "certify"
      );
      console.info("message: ", message);
      return res.status(200).json(message);
    } catch (err) {
      next(err);
    }
  },
  postDrop: async (req, res, next) => {
    console.info("ManagerController.postDrop");
    try {
      // get tokens from header
      const id_token =
        process.env.ENV == "local"
          ? JSON.parse(process.env.TOKENS)["id_token"]
          : req.headers.id_token;
      let decodedIdJwt = jwt.decode(id_token, { complete: true });
      if (!decodedIdJwt) {
        throw CreateError[401]({ message: "Not a valid Id JWT token" });
      }
      if (
        decodedIdJwt.payload["custom:manager"] !== "true" &&
        decodedIdJwt.payload["custom:caller"] !== "true"
      ) {
        throw CreateError[401]({ message: "Not a manager or a caller" });
      }
      const admin_username = decodedIdJwt.payload["preferred_username"];
      const service = new ManagerService();
      const message = await service.action2Class(
        req.body,
        admin_username,
        "drop"
      );
      console.info("message: ", message);
      return res.status(200).json(message);
    } catch (err) {
      throw CreateError[500]({
        message: "Error to drop class: " + JSON.stringify(err),
      });
    }
  },
  postMiss: async (req, res, next) => {
    // get tokens from header
    const id_token =
      process.env.ENV == "local"
        ? JSON.parse(process.env.TOKENS)["id_token"]
        : req.headers.id_token;
    let decodedIdJwt = jwt.decode(id_token, { complete: true });
    if (!decodedIdJwt) {
      throw CreateError[401]({ message: "Not a valid Id JWT token" });
    }
    if (
      decodedIdJwt.payload["custom:manager"] !== "true" &&
      decodedIdJwt.payload["custom:caller"] !== "true"
    ) {
      throw CreateError[401]({
        message: "Not a manager or after class manager",
      });
    }
    const admin_username = decodedIdJwt.payload["preferred_username"];
    try {
      const service = new ManagerService();
      const message = await service.action2Class(
        req.body,
        admin_username,
        "miss"
      );
      console.info("message: ", message);
      return res.status(200).json(message);
    } catch (err) {
      next(err);
    }
  },
  postIgnore: async (req, res, next) => {
    console.info("ManagerController.postIgnore");
    try {
      // get tokens from header
      const id_token =
        process.env.ENV == "local"
          ? JSON.parse(process.env.TOKENS)["id_token"]
          : req.headers.id_token;
      let decodedIdJwt = jwt.decode(id_token, { complete: true });
      if (!decodedIdJwt) {
        throw CreateError[401]({ message: "Not a valid Id JWT token" });
      }
      if (
        decodedIdJwt.payload["custom:manager"] !== "true" &&
        decodedIdJwt.payload["custom:caller"] !== "true"
      ) {
        throw CreateError[401]({ message: "Not a manager or caller" });
      }
      const admin_username = decodedIdJwt.payload["preferred_username"];
      const service = new ManagerService();
      const message = await service.action2Class(
        req.body,
        admin_username,
        "ignore"
      );
      console.info("message: ", message);
      return res.status(200).json(message);
    } catch (err) {
      throw CreateError[500]({
        message: "Error to ignore class: " + JSON.stringify(err),
      });
    }
  },
  postWait: async (req, res, next) => {
    console.info("ManagerController.postWait");
    try {
      // get tokens from header
      const id_token =
        process.env.ENV == "local"
          ? JSON.parse(process.env.TOKENS)["id_token"]
          : req.headers.id_token;
      let decodedIdJwt = jwt.decode(id_token, { complete: true });
      if (!decodedIdJwt) {
        throw CreateError[401]({ message: "Not a valid Id JWT token" });
      }
      if (
        decodedIdJwt.payload["custom:manager"] !== "true" &&
        decodedIdJwt.payload["custom:caller"] !== "true"
      ) {
        throw CreateError[401]({ message: "Not a manager or caller" });
      }
      const admin_username = decodedIdJwt.payload["preferred_username"];
      const service = new ManagerService();
      const message = await service.action2Class(
        req.body,
        admin_username,
        "wait"
      );
      console.info("message: ", message);
      return res.status(200).json(message);
    } catch (err) {
      throw CreateError[500]({
        message: "Error to wait class: " + JSON.stringify(err),
      });
    }
  },
  deleteEnroll: async (req, res, next) => {
    console.info("ManagerController.deleteEnroll");
    // try {
      // get tokens from header
      const id_token =
        process.env.ENV == "local"
          ? JSON.parse(process.env.TOKENS)["id_token"]
          : req.headers.id_token;
      let decodedIdJwt = jwt.decode(id_token, { complete: true });
      if (!decodedIdJwt) {
        throw CreateError[401]({ message: "Not a valid Id JWT token" });
      }
      if (
        decodedIdJwt.payload["custom:manager"] !== "true"
      ) {
        throw CreateError[401]({ message: "Not a manager!" });
      }
      const service = new ManagerService();
      const message = await service.deleteEnroll(req.body);
      return res.status(204).json(message);
    // } catch (err) {
    //   throw CreateError[500]({
    //     message: "Erro to delete enroll: " + JSON.stringify(err),
    //   });
    // }
  },
};

module.exports = ManagerController;
