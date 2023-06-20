const { UserModelDb: UserModel } = require("../model/user-model-db.js");
const { EnrollModelDb: EnrollModel } = require("../model/enroll-model-db.js");
const Ajv = require("ajv");
const CreateError = require("http-errors");

const EnrollSchema = {
  type: "object",
  properties: {
    user: { type: "object" },
    enroll: { type: "object" },
  },
  required: ["user", "enroll"],
  additionalProperties: false,
};

class EnrollService {
  async enrollToWaitList(data) {
    console.info("EnrollService.enrollToWaitList");
    // Validate JSON data
    this.validateEnrollJson(data);

    // Create/Get User
    const { user } = data;

    const userModel = new UserModel(user);
    await userModel.save(); // created or existed
    const user_id = {
      driver_license_UF: user.driverLicenseUF,
      driver_license: user.driverLicense,
    };
    const userDynamo = await UserModel.getById(user_id);

    // check if user already has enroll in waiting
    console.info("check if user already has enroll in waiting");
    console.info(userDynamo.enroll);
    let enroll_id = undefined;
    for (let enroll of userDynamo.enroll) {
      const enrollDyn = await EnrollModel.getById(enroll);
      console.info(enrollDyn.status);
      if (enrollDyn.status !== "certified" && enrollDyn.status !== "missed" && enrollDyn.status !== "ignored") {
        // are final status of enroll!
        enroll_id = enroll; /// then I have an waiting or intermediary status (ongoing enroll)
      }
    }

    // Create enrolls if not waiting
    let status = "waiting"; // already enrolled
    console.log("Enroll");
    console.log(enroll_id);
    if (enroll_id === undefined) {
      const { enroll } = data;
      console.log(enroll);
      const enrollModel = new EnrollModel(enroll);
      console.log(user_id);
      const enrollDynamo = await enrollModel.save(user_id); // pass user ID (via PK)
      enroll_id = {
        city: enrollDynamo.city,
        enroll_date: enrollDynamo.enroll_date,
      };
      // update user enrolls
      userDynamo.enroll.push(enroll_id); // append new enrollId
      await userModel.update(userDynamo.enroll);
      status = "enrolled"; // new enroll created
    }

    // Local
    if (process.env.ENV !== "production") {
      console.info("User");
      console.info(await UserModel.getById(user_id));
      console.info("Enroll");
      console.info(await EnrollModel.getById(enroll_id));
    }

    return status;
  }

  validateEnrollJson(data) {
    // Validade main structure
    const ajv = new Ajv({ allErrors: true });
    const valid = ajv.validate(EnrollSchema, data);
    if (!valid) {
      const mp = ajv.errors.map((error) => {
        return error.params.missingProperty;
      });
      throw CreateError[400]({ message: `Missing property on body: ${mp}` });
    }
  }
}

module.exports = EnrollService;
