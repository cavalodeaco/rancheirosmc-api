import { ClassService } from "../service/class-service.js";
import CreateError from "http-errors";
import jwt from "jsonwebtoken";

const ClassController = {
  post: async (req, res, next) => {
    // get tokens from header
    const id_token = req.headers.id_token;
    let decodedIdJwt = jwt.decode(id_token, { complete: true });
    if (!decodedIdJwt) {
        throw CreateError[401]('Not a valid Id JWT token');
    }
    if (decodedIdJwt.payload["custom:manager"] !== "true") {
        throw CreateError[401]('Not a manager');
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
      res.status(status).json({message: classStatus});
    } catch (err) {
      next(err);
    }
  },
  get: async (req, res, next) => {
    try {
      const service = new ClassService();
      const classes = await service.get(req.headers.limit, req.headers.page ? JSON.parse(req.headers.page) : undefined);
      res.status(200).json({message: classes});
    } catch (err) {
      next(err);
    }
  }
}

export default ClassController;