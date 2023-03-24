import ManagerService from '../service/manager-service.js';
import jwt from "jsonwebtoken";

const ManagerController = {
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
      const callMessage = await service.call2Class(req.body, admin_username);
      console.log("callMessage: ", callMessage);
      if (callMessage.message == "partial") {
        return res.status(206).json(callMessage);
      }
      return res.status(200).json(callMessage);
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
      const callMessage = await service.action2Class(req.body, admin_username, "confirm");
      console.log("callMessage: ", callMessage);
      if (callMessage.message == "partial") {
        return res.status(206).json(callMessage);
      }
      return res.status(200).json(callMessage);
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
      const callMessage = await service.action2Class(req.body, admin_username, "certify");
      console.log("callMessage: ", callMessage);
      if (callMessage.message == "partial") {
        return res.status(206).json(callMessage);
      }
      return res.status(200).json(callMessage);
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
      const callMessage = await service.action2Class(req.body, admin_username, "drop");
      console.log("callMessage: ", callMessage);
      if (callMessage.message == "partial") {
        return res.status(206).json(callMessage);
      }
      return res.status(200).json(callMessage);
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
      const callMessage = await service.action2Class(req.body, admin_username, "miss");
      console.log("callMessage: ", callMessage);
      if (callMessage.message == "partial") {
        return res.status(206).json(callMessage);
      }
      return res.status(200).json(callMessage);
    } catch (err) {
      next(err);
    }
  }
}

export default ManagerController;