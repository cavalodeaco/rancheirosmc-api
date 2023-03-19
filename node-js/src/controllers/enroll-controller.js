import EnrollService from '../service/enroll-service.js';
import jwt from "jsonwebtoken";

const EnrollController = {
  postEnroll: async (req, res, next) => {
    try {
      const service = new EnrollService();
      const enrollStatus = await service.enrollToWaitList(req.body);
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
  postCall: async (req, res, next) => {
    // get tokens from header
    const id_token = process.env.ENV == "local" ? JSON.parse(process.env.TOKENS)["id_token"] : req.headers.id_token;
    let decodedIdJwt = jwt.decode(id_token, { complete: true });
    if (!decodedIdJwt) {
      throw CreateError[401]({ message: 'Not a valid Id JWT token' });
    }
    if (decodedIdJwt.payload["custom:manager"] !== "true") {
      throw CreateError[401]({ message: 'Not a manager' });
    }
    const admin_username = decodedIdJwt.payload["preferred_username"];
    try {
      const service = new EnrollService();
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
    if (decodedIdJwt.payload["custom:manager"] !== "true") {
      throw CreateError[401]({ message: 'Not a manager' });
    }
    const admin_username = decodedIdJwt.payload["preferred_username"];
    try {
      const service = new EnrollService();
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
    if (decodedIdJwt.payload["custom:manager"] !== "true") {
      throw CreateError[401]({ message: 'Not a manager' });
    }
    const admin_username = decodedIdJwt.payload["preferred_username"];
    try {
      const service = new EnrollService();
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
    if (decodedIdJwt.payload["custom:manager"] !== "true") {
      throw CreateError[401]({ message: 'Not a manager' });
    }
    const admin_username = decodedIdJwt.payload["preferred_username"];
    try {
      const service = new EnrollService();
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
    if (decodedIdJwt.payload["custom:manager"] !== "true") {
      throw CreateError[401]({ message: 'Not a manager' });
    }
    const admin_username = decodedIdJwt.payload["preferred_username"];
    try {
      const service = new EnrollService();
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

export default EnrollController;