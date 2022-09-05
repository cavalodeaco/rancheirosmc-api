import EnrollService from '../../service/enroll/enroll-service.js';

const EnrollController = {
  postEnroll: async (req, res, next) => {
    try {
      const service = new EnrollService();
      const enrollStatus = await service.enrollToWaitList(req.body);
      var status = 500;
      switch (enrollStatus) {
        case "enrolled": 
          status = 201;
          break;
        case "waiting":
          status = 409;
          break;
      }
      res.status(status).json({message: enrollStatus});
    } catch (err) {
      next(err);
    }
  }
}

export default EnrollController;