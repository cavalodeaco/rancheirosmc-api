import EnrollService from '../../service/enroll/enroll-service.js';

const EnrollController = {
  postEnroll: async (req, res, next) => {
    try {
      const service = new EnrollService();
      const { userDynamo, userDynamoTest, enrollDynamoTest } = await service.enrollToWaitList(req.body);
      res.json({ userDynamo, userDynamoTest, enrollDynamoTest });
    } catch (err) {
      next(err);
    }
  }
}

export default EnrollController;