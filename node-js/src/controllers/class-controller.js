import { ClassServce } from "../service/class-service";
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
    if (decodedIdJwt["custom:manager"] !== "true") {
        throw CreateError[401]('Not a manager');
    }
    const admin_username = decodedIdJwt["preferred_username"];
    try {
      const service = new ClassServce();
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
  }
}

export default ClassController;