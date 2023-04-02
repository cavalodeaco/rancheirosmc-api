const { EnrollModelDb: EnrollModel } = require("../model/enroll-model-db.js");
const { UserModelDb: UserModel } = require("../model/user-model-db.js");

class ReportService {
  async getEnrolls(limit, page, id_token) {
    console.log("Service: getEnrolls");

    try {
      let cities = [];
      let cityFilter = undefined;
      let cityExpressionAttributeValues = {};
      if (id_token["custom:cities"] !== "all") {
        cities = id_token["custom:cities"].split(",");
        cityFilter =
          "city IN (" + cities.map((item) => `:city_${item}`).join() + ")";
        for (let i = 0; i < cities.length; i++) {
          cityExpressionAttributeValues[`:city_${cities[i]}`] = cities[i];
        }
      }

      let statuses = [];
      let statusFilter = undefined;
      let statusExpressionAttributeValues = {};
      if (id_token["custom:enroll_status"] !== "all") {
        statuses = id_token["custom:enroll_status"].split(",");
        statusFilter =
          "enroll_status IN (" +
          statuses.map((item) => `:status_${item}`).join() +
          ")";
        for (let i = 0; i < statuses.length; i++) {
          statusExpressionAttributeValues[`:status_${statuses[i]}`] =
            statuses[i];
        }
      }

      let filter = undefined;
      let expressionAttributeValues = undefined;
      if (cities.length > 0 && statuses.length > 0) {
        filter = `${cityFilter} AND ${statusFilter}`;
        expressionAttributeValues = Object.assign(
          {},
          cityExpressionAttributeValues,
          statusExpressionAttributeValues
        );
      } else if (cities.length > 0) {
        filter = cityFilter;
        expressionAttributeValues = cityExpressionAttributeValues;
      } else if (statuses.length > 0) {
        filter = statusFilter;
        expressionAttributeValues = statusExpressionAttributeValues;
      }

      return {
        status: 200,
        data: await EnrollModel.get(
          limit,
          page,
          filter,
          undefined,
          expressionAttributeValues
        ),
      };
    } catch (error) {
      throw CreateError(500, "Error getting enrolls", error);
    }
  }

  async getUsers(limit, page) {
    console.log("Service: getUsers");
    return { status: 200, data: await UserModel.get(limit, page) };
  }
}

module.exports = ReportService;
