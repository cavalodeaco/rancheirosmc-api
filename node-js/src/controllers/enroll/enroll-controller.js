import EnrollService from '../../service/enroll/enroll-service.js';

const EnrollController = {
  postEnroll: async (req, res, next) => {
    try {
      const { userDynamo, myOtherUser } = await EnrollService.enrollToWaitList(req.body);
      res.json({ userDynamo, myOtherUser });
    } catch (err) {
      next(err);
    }
  }
}

export default EnrollController;