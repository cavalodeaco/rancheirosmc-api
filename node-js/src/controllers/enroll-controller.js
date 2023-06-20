const EnrollService = require("../service/enroll-service.js");
const CreateError = require("http-errors");

const EnrollController = {
  postEnroll: async (req, res, next) => {
    console.info("EnrollController.postEnroll");
    // try {
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
      default: {
        throw (
          "Error to enroll: " + enrollStatus + " " + JSON.stringify(req.body)
        );
      }
    }
    console.info("response: ", status, enrollStatus);
    return res.status(status).json({ message: enrollStatus });
    // } catch (err) {
    //   throw CreateError[500]({
    //     message: "Error to enroll: " + JSON.stringify(err),
    //   });
    // }
  },
};

module.exports = EnrollController;
