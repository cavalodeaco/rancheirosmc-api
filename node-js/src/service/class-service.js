const { ClassModelDb } = require("../model/class-model-db.js");
const { EnrollModelDb } = require("../model/enroll-model-db.js");
const { UserModelDb } = require("../model/user-model-db.js");
const CreateError = require("http-errors");

class ClassService {
  async create(data, admin_username) {
    console.info("ClassService.create");
    console.info(data, admin_username);
    const classModel = new ClassModelDb(data);
    const status = await classModel.save(admin_username);
    console.info("Status: ", status);
    return status;
  }
  async get(limit, page, id_token) {
    console.info("ClassService.get");
    try {
      let filter = undefined;
      let expressionAttributeValues = undefined;

      if (id_token["custom:cities"] !== "all") {
        const cities = id_token["custom:cities"].split(",");
        let cityFilter =
          "city IN (" + cities.map((item) => `:city_${item}`).join() + ")";
        let cityExpressionAttributeValues = {};
        for (let i = 0; i < cities.length; i++) {
          cityExpressionAttributeValues[`:city_${cities[i]}`] = cities[i];
        }

        if (cities.length > 0) {
          filter = cityFilter;
          expressionAttributeValues = cityExpressionAttributeValues;
        }
      }
      return {
        status: 200,
        data: await ClassModelDb.get(
          limit,
          page,
          filter,
          undefined,
          expressionAttributeValues
        ),
      };
    } catch (error) {
      throw CreateError(500, "Error getting classes: " + JSON.stringify(error));
    }
  }
  async download(filter) {
    console.info("ClassService.download");
    let enrolls = await EnrollModelDb.getByClass(filter);
    // for each enroll, get the user data
    for (const enroll of enrolls.Items) {
      const user = await UserModelDb.getById(enroll.user);
      enroll.user.name = user.name;
    }
    return enrolls;
  }
}

module.exports = { ClassService };
