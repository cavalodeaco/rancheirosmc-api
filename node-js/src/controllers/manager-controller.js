import ManagerService from '../service/manager-service.js';
import jwt from "jsonwebtoken";

const ManagerController = {
  updateClass: async (req, res, next) => {
    // get tokens from header
    const id_token = process.env.ENV == "local" ? JSON.parse(process.env.TOKENS)["id_token"] : req.headers.id_token;
    let decodedIdJwt = jwt.decode(id_token, { complete: true });
    if (!decodedIdJwt) {
      throw CreateError[401]({ message: 'Not a valid Id JWT token' });
    }
    if (decodedIdJwt.payload["custom:manager"] !== "true" && decodedIdJwt.payload["custom:caller"] !== "true") {
      throw CreateError[401]({ message: 'Not a manager a caller' });
    }
    const admin_username = decodedIdJwt.payload["preferred_username"];
    try {
      const service = new ManagerService();
      await service.updateClass(req.body, admin_username);
      return res.status(204).json({message: "Enroll updated"});
    } catch (err) {
      next(err);
    }
  },
  updateEnroll: async (req, res, next) => {
    // get tokens from header
    const id_token = process.env.ENV == "local" ? JSON.parse(process.env.TOKENS)["id_token"] : req.headers.id_token;
    let decodedIdJwt = jwt.decode(id_token, { complete: true });
    if (!decodedIdJwt) {
      throw CreateError[401]({ message: 'Not a valid Id JWT token' });
    }
    if (decodedIdJwt.payload["custom:manager"] !== "true" && decodedIdJwt.payload["custom:caller"] !== "true") {
      throw CreateError[401]({ message: 'Not a manager a caller' });
    }
    const admin_username = decodedIdJwt.payload["preferred_username"];
    try {
      const service = new ManagerService();
      await service.updateEnroll(req.body, admin_username);
      return res.status(204).json({message: "Enroll updated"});
    } catch (err) {
      next(err);
    }
  },
  postCall: async (req, res, next) => {
    // get tokens from header
    const id_token = process.env.ENV == "local" ? JSON.parse(process.env.TOKENS)["id_token"] : req.headers.id_token;
    let decodedIdJwt = jwt.decode(id_token, { complete: true });
    if (!decodedIdJwt) {
      throw CreateError[401]({ message: 'Not a valid Id JWT token' });
    }
    if (decodedIdJwt.payload["custom:manager"] !== "true" && decodedIdJwt.payload["custom:caller"] !== "true") {
      throw CreateError[401]({ message: 'Not a manager a caller' });
    }
    const admin_username = decodedIdJwt.payload["preferred_username"];
    try {
      const service = new ManagerService();
      const message = await service.call2Class(req.body, admin_username);
      console.log("message: ", message);
      if (message.message == "partial") {
        return res.status(206).json(message);
      }
      return res.status(200).json(message);
    } catch (err) {
      next(err);
    }
  },
  postConfirm: async (req, res, next) => {
    // get tokens from header
    const id_token = process.env.ENV == "local" ? JSON.parse(process.env.TOKENS)["id_token"] : req.headers.id_token;
    let decodedIdJwt = jwt.decode(id_token, { complete: true });
    if (!decodedIdJwt) {
      throw CreateError[401]({ message: 'Not a valid Id JWT token' });
    }
    if (decodedIdJwt.payload["custom:manager"] !== "true" && decodedIdJwt.payload["custom:caller"] !== "true") {
      throw CreateError[401]({ message: 'Not a manager or a caller' });
    }
    const admin_username = decodedIdJwt.payload["preferred_username"];
    try {
      const service = new ManagerService();
      const message = await service.action2Class(req.body, admin_username, "confirm");
      console.log("message: ", message);
      if (message.message == "partial") {
        return res.status(206).json(message);
      }
      return res.status(200).json(message);
    } catch (err) {
      next(err);
    }
  },
  postCertify: async (req, res, next) => {
    // get tokens from header
    const id_token = process.env.ENV == "local" ? JSON.parse(process.env.TOKENS)["id_token"] : req.headers.id_token;
    let decodedIdJwt = jwt.decode(id_token, { complete: true });
    if (!decodedIdJwt) {
      throw CreateError[401]({ message: 'Not a valid Id JWT token' });
    }
    if (decodedIdJwt.payload["custom:manager"] !== "true" && decodedIdJwt.payload["custom:posclass"] !== "true") {
      throw CreateError[401]({ message: 'Not a manager or after class manager' });
    }
    const admin_username = decodedIdJwt.payload["preferred_username"];
    try {
      const service = new ManagerService();
      const message = await service.action2Class(req.body, admin_username, "certify");
      console.log("message: ", message);
      if (message.message == "partial") {
        return res.status(206).json(message);
      }
      return res.status(200).json(message);
    } catch (err) {
      next(err);
    }
  },
  postDrop: async (req, res, next) => {
    // get tokens from header
    const id_token = process.env.ENV == "local" ? JSON.parse(process.env.TOKENS)["id_token"] : req.headers.id_token;
    let decodedIdJwt = jwt.decode(id_token, { complete: true });
    if (!decodedIdJwt) {
      throw CreateError[401]({ message: 'Not a valid Id JWT token' });
    }
    if (decodedIdJwt.payload["custom:manager"] !== "true" && decodedIdJwt.payload["custom:caller"] !== "true") {
      throw CreateError[401]({ message: 'Not a manager or a caller' });
    }
    const admin_username = decodedIdJwt.payload["preferred_username"];
    try {
      const service = new ManagerService();
      const message = await service.action2Class(req.body, admin_username, "drop");
      console.log("message: ", message);
      if (message.message == "partial") {
        return res.status(206).json(message);
      }
      return res.status(200).json(message);
    } catch (err) {
      next(err);
    }
  },
  postMiss: async (req, res, next) => {
    // get tokens from header
    const id_token = process.env.ENV == "local" ? JSON.parse(process.env.TOKENS)["id_token"] : req.headers.id_token;
    let decodedIdJwt = jwt.decode(id_token, { complete: true });
    if (!decodedIdJwt) {
      throw CreateError[401]({ message: 'Not a valid Id JWT token' });
    }
    if (decodedIdJwt.payload["custom:manager"] !== "true" && decodedIdJwt.payload["custom:posclass"] !== "true") {
      throw CreateError[401]({ message: 'Not a manager or after class manager' });
    }
    const admin_username = decodedIdJwt.payload["preferred_username"];
    try {
      const service = new ManagerService();
      const message = await service.action2Class(req.body, admin_username, "miss");
      console.log("message: ", message);
      if (message.message == "partial") {
        return res.status(206).json(message);
      }
      return res.status(200).json(message);
    } catch (err) {
      next(err);
    }
  },
  postIgnore: async (req, res, next) => {
    // get tokens from header
    const id_token = process.env.ENV == "local" ? JSON.parse(process.env.TOKENS)["id_token"] : req.headers.id_token;
    let decodedIdJwt = jwt.decode(id_token, { complete: true });
    if (!decodedIdJwt) {
      throw CreateError[401]({ message: 'Not a valid Id JWT token' });
    }
    if (decodedIdJwt.payload["custom:manager"] !== "true" && decodedIdJwt.payload["custom:caller"] !== "true") {
      throw CreateError[401]({ message: 'Not a manager or caller' });
    }
    const admin_username = decodedIdJwt.payload["preferred_username"];
    try {
      const service = new ManagerService();
      const message = await service.action2Class(req.body, admin_username, "ignore");
      console.log("message: ", message);
      if (message.message == "partial") {
        return res.status(206).json(message);
      }
      return res.status(200).json(message);
    } catch (err) {
      next(err);
    }
  }
}

export default ManagerController;