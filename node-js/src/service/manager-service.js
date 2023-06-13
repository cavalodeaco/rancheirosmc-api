const { EnrollModelDb: EnrollModel } = require("../model/enroll-model-db.js");
const Ajv = require("ajv");
const CreateError = require("http-errors");
const { ClassModelDb: ClassModel } = require("../model/class-model-db.js");
const { UserModelDb: UserModel } = require("../model/user-model-db.js");

const EnrollUpdateSchema = {
  type: "object",
  properties: {
    city: { type: "string" },
    enroll_date: { type: "string" },
    class_name: { type: "string" },
    enroll_status: { type: "string" },
  },
  required: ["city", "enroll_date"],
  additionalProperties: false,
};

const DeleteSchema = {
  type: "object",
  properties: {
    enrolls: {
      type: "array",
      items: {
        type: "object",
        properties: {
          city: { type: "string" },
          enroll_date: { type: "string" },
          driver_license: { type: "string" },
          driver_license_UF: { type: "string" },
        },
        required: ["city", "enroll_date", "driver_license_UF", "driver_license"],
      },
    },
  },
  required: ["enrolls"],
  additionalProperties: true,
};

const EnrollCallSchema = {
  type: "object",
  properties: {
    enrolls: {
      type: "array",
      items: {
        type: "object",
        properties: {
          city: { type: "string" },
          enroll_date: { type: "string" },
        },
        required: ["city", "enroll_date"],
      },
    },
    class_name: { type: "string" },
  },
  required: ["class_name", "enrolls"],
  additionalProperties: false,
};

const EnrollConfirmCertifyMissDropSchema = {
  type: "object",
  properties: {
    enrolls: {
      type: "array",
      items: {
        type: "object",
        properties: {
          city: { type: "string" },
          enroll_date: { type: "string" },
        },
        required: ["city", "enroll_date"],
      },
    },
  },
  required: ["enrolls"],
  additionalProperties: true,
};

const ClassUpdateSchema = {
  type: "object",
  properties: {
    city: { type: "string" },
    date: { type: "string" },
    location: { type: "string" },
    active: { type: "string" },
  },
  required: ["city", "date"],
  additionalProperties: false,
};

const regex = /^.PV (\d{2}\/\d{2}\/\d{4}) \((\w+)\)$/;

class ManagerService {
  async updateClass(data, admin_username) {
    console.info("ManagerService.udpateClass");
    // Validate JSON data
    this.validateJson(data, ClassUpdateSchema);

    const classDyn = await ClassModel.getById({
      city: data.city,
      date: data.date,
    });
    if (data.location) classDyn.location = data.location;
    if (data.active) classDyn.active = data.active;
    await ClassModel.update(classDyn, admin_username);
    if (process.env.ENV != "production")
      console.info("ManagerService.udpateClass: done");
  }
  async updateEnroll(data, admin_username) {
    console.info("ManagerService.upateEnroll");
    // Validate JSON data
    this.validateJson(data, EnrollUpdateSchema);

    const enrollDynamo = await EnrollModel.getById({
      city: data.city,
      enroll_date: data.enroll_date,
    });
    if (data.enroll_status) enrollDynamo.enroll_status = data.enroll_status;
    if (data.class_name) enrollDynamo.class = data.class_name;
    await EnrollModel.updateEnrollStatusPlusClass(enrollDynamo, admin_username);
    if (process.env.ENV != "production")
      console.info("ManagerService.updateEnroll: done");
  }

  validateJson(data, schema) {
    console.info("ManagerService.validateJson");
    // Validade main structure
    const ajv = new Ajv({ allErrors: true });
    const valid = ajv.validate(schema, data);
    if (!valid) {
      const mp = ajv.errors.map((error) => {
        return error.params.missingProperty;
      });
      throw CreateError[400]({ message: `Missing property on body: ${mp}` });
    }
  }

  async call2Class(data, admin_username) {
    console.info("ManagerService.call2Class");
    // Validate JSON data
    this.validateJson(data, EnrollCallSchema);

    const { enrolls } = data;
    const { class_name } = data;
    // validate if class exists
    const match = regex.exec(class_name); // MPV 11/03/2023 (curitiba)
    try {
      const date = match[1]; // "11/03/2023"
      const city = match[2]; // "curitiba"
      const class_ = await ClassModel.getById({ city: city, date: date });
      if (class_ == undefined) {
        throw CreateError[400]({
          message: `Turma não encontrada: ${class_name}`,
        });
      }
    } catch (error) {
      throw CreateError[400]({
        message: `Nome de turma inválido: ${class_name}`,
      });
    }

    const message = [];
    for (const enroll of enrolls) {
      const status = { id:enroll.id }
      const enrollDynamo = await EnrollModel.getById({
        city: enroll.city,
        enroll_date: enroll.enroll_date,
      });
      console.info(enrollDynamo);
      if (
        enrollDynamo.enroll_status == "waiting" ||
        enrollDynamo.enroll_status == "legacy_waiting" ||
        enrollDynamo.enroll_status == "dropped"
      ) {
        enrollDynamo.enroll_status = "called";
        enrollDynamo.class = class_name;
        await EnrollModel.updateEnrollStatusPlusClass(
          enrollDynamo,
          admin_username
        );
        status["status"] = "success";
        status["enroll"] = await EnrollModel.getById({
          city: enroll.city,
          enroll_date: enroll.enroll_date,
        });
        status["enroll"]["user"]["name"] = enroll.name; // biker name
      } else {
        status["status"] = "fail";
        status["message"] =  "Status inválido para ação: " + enrollDynamo.enroll_status;
        status["enroll"] = {user: {name: enroll.name}} // biker name
      }
      message.push(status);
    }
    return message;
  }

  async action2Class(data, admin_username, type) {
    console.info("ManagerService.action2Class");
    // Validate JSON data
    this.validateJson(data, EnrollConfirmCertifyMissDropSchema);

    const { enrolls } = data;
    const message = [];
    for (const enroll of enrolls) {
      const status = { id:enroll.id }
      const enrollDynamo = await EnrollModel.getById({
        city: enroll.city,
        enroll_date: enroll.enroll_date,
      });
      const action2ClassValidation = {
        confirm: {
          condition:
            enrollDynamo.enroll_status == "called" &&
            !(enrollDynamo.class == "none" || enrollDynamo.class === undefined),
          status: "confirmed",
        },
        certify: {
          condition:
            enrollDynamo.enroll_status == "confirmed" &&
            !(enrollDynamo.class == "none" || enrollDynamo.class === undefined),
          status: "certified",
        },
        miss: {
          condition:
            enrollDynamo.enroll_status == "confirmed" &&
            !(enrollDynamo.class == "none" || enrollDynamo.class === undefined),
          status: "missed",
        },
        drop: {
          condition:
            (enrollDynamo.enroll_status == "called" ||
              enrollDynamo.enroll_status == "confirmed") &&
            !(enrollDynamo.class == "none" || enrollDynamo.class === undefined),
          status: "dropped",
        },
        ignore: {
          condition: enrollDynamo.enroll_status !== "certified",
          status: "ignored",
        },
        wait: {
          condition: enrollDynamo.enroll_status !== "certified",
          status: "waiting",
        },
      };
      if (action2ClassValidation[type].condition) {
        enrollDynamo.enroll_status = action2ClassValidation[type].status;
        if (type == "drop" || type == "wait" || type == "ignore") {
          enrollDynamo.class = "none";
          await EnrollModel.updateEnrollStatusPlusClass(
            enrollDynamo,
            admin_username
          );
        } else {
          await EnrollModel.updateEnrollStatus(enrollDynamo, admin_username);
        }
        status["status"] = "success";
        status["enroll"] = await EnrollModel.getById({
          city: enroll.city,
          enroll_date: enroll.enroll_date,
        });
        status["enroll"]["user"]["name"] = enroll.name; // biker name
      } else {
        status["status"] = "fail";
        status["message"] =  "Status inválido para ação: " + enrollDynamo.enroll_status;
        status["enroll"] = {user: {name: enroll.name}} // biker name
      }
      message.push(status);
    }
    return message;
  }

  async deleteEnroll(data) {
    console.info("ManagerService.deleteEnroll");
    console.log(data);
    // Validate JSON data
    this.validateJson(data, DeleteSchema);

    console.log(data);

    const {enrolls} = data;

    // check if enroll exists
    const enrollDynamo = await EnrollModel.getById({
      city: enrolls[0].city,
      enroll_date: enrolls[0].enroll_date,
    });

    // check if user exists
    const userDynamo = await UserModel.getById({
      driver_license_UF: enrolls[0].driver_license_UF,
      driver_license: enrolls[0].driver_license,
    });

    // if all delete!
    if (enrollDynamo && userDynamo) {
      // delete enroll
      const enrollRes = await EnrollModel.delete({
        city: enrolls[0].city,
        enroll_date: enrolls[0].enroll_date,
      });      
      // delete user
      const userRes = await UserModel.delete({
        driver_license_UF: enrolls[0].driver_license_UF,
        driver_license: enrolls[0].driver_license,
      });
      if (enrollRes.httpStatusCode == 200 && userRes.httpStatusCode) {
        return {status: "success", message: "Deleted!"};
      }
    }

    return {status: "fail", message: "User or Enroll not found"};
  }
}

module.exports = ManagerService;
