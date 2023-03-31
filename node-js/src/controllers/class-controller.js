import { ClassService } from "../service/class-service.js";
import CreateError from "http-errors";
import jwt from "jsonwebtoken";
import getIdToken from '../libs/get-tokens.js';

const ClassController = {
  post: async (req, res, next) => {
    // get tokens from header
    const id_token = process.env.ENV == "local" ? JSON.parse(process.env.TOKENS)["id_token"] : req.headers.id_token;
    let decodedIdJwt = jwt.decode(id_token, { complete: true });
    if (!decodedIdJwt) {
        throw CreateError[401]({message:'Not a valid Id JWT token'});
    }
    if (decodedIdJwt.payload["custom:manager"] !== "true" && decodedIdJwt.payload["custom:manage_class"] !== "true") {
        throw CreateError[401]({message:'Not a manager or class admin'});
    }
    const admin_username = decodedIdJwt.payload["preferred_username"];
    try {
      const service = new ClassService();
      const classStatus = await service.create(req.body, admin_username);
      let status = 500;
      switch (classStatus) {
        case "created": 
          status = 201;
          break;
      }
      return res.status(status).json({message: classStatus});
    } catch (err) {
      next(err);
    }
  },
  get: async (req, res, next) => {
    try {
      const id_token = getIdToken(req.headers);
      const service = new ClassService();
      const classes = await service.get(req.headers.limit, req.headers.page ? JSON.parse(req.headers.page) : undefined, id_token);
      return res.status(200).json({message: classes});
    } catch (err) {
      next(err);
    }
  },
  download: async (req, res, next) => {
    // get tokens from header
    const id_token = process.env.ENV == "local" ? JSON.parse(process.env.TOKENS)["id_token"] : req.headers.id_token;
    let decodedIdJwt = jwt.decode(id_token, { complete: true });
    if (!decodedIdJwt) {
        throw CreateError[401]({message:'Not a valid Id JWT token'});
    }
    if (decodedIdJwt.payload["custom:manager"] !== "true" 
        && decodedIdJwt.payload["custom:download"] !== "true" ) {
        throw CreateError[401]({message:'Not a manager or download admin'});
    }
    try {
      const service = new ClassService();
      if (process.env.ENV == "local") 
        console.log("filter download: ", req.headers.filter);
      const download = await service.download(req.headers.filter);
      return res.status(200).json({message: download});
    } catch (err) {
      next(err);
    }
  },
}

export default ClassController;