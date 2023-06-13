const { dynamoDbDoc } = require("../libs/ddb-doc.js");
const {
  ScanCommand,
  PutCommand,
  GetCommand,
  UpdateCommand,
  QueryCommand,
  DeleteCommand
} = require("@aws-sdk/lib-dynamodb");
const Ajv = require("ajv");
const CreateError = require("http-errors");

const EnrollSchemaAjv = {
  type: "object",
  properties: {
    user: {
      type: "object",
      properties: {
        driver_license_UF: { type: "string" },
        driver_license: { type: "string" },
      },
      required: ["driver_license_UF", "driver_license"],
    },
    city: { type: "string" },
    motorcycle: {
      type: "object",
      properties: {
        brand: { type: "string" },
        model: { type: "string" },
      },
      required: ["brand", "model"],
    },
    use: { type: "string" },
    terms: {
      type: "object",
      properties: {
        authorization: { type: "boolean" },
        responsibility: { type: "boolean" },
        lgpd: { type: "boolean" },
      },
      required: ["responsibility", "lgpd"],
    },
  },
  required: ["user", "city", "motorcycle", "use", "terms"],
  additionalProperties: false,
};

const EnrollLegacySchemaAjv = {
  type: "object",
  properties: {
    user: {
      type: "object",
      properties: {
        driver_license_UF: { type: "string" },
        driver_license: { type: "string" },
      },
      required: ["driver_license_UF", "driver_license"],
    },
    city: { type: "string" },
    motorcycle: {
      type: "object",
      properties: {
        brand: { type: "string" },
        model: { type: "string" },
      },
      required: ["brand", "model"],
    },
    use: { type: "string" },
    class: { type: "string" },
    enroll_date: { type: "string" },
    enroll_status: { type: "string" },
    terms: {
      type: "object",
      properties: {
        authorization: { type: "boolean" },
        responsibility: { type: "boolean" },
        lgpd: { type: "boolean" },
      },
      required: ["responsibility", "lgpd"],
    },
  },
  required: [
    "user",
    "city",
    "motorcycle",
    "use",
    "terms",
    "class",
    "enroll_date",
  ],
  additionalProperties: false,
};

class EnrollModelDb {
  constructor(enrollData) {
    this.enrollData = enrollData;
    this.enroll = null;
  }

  async save(userID) {
    console.info("EnrollModelDb.save");

    // Validate Enroll
    this.enrollData.user = userID;
    EnrollModelDb.validate(this.enrollData, EnrollSchemaAjv);

    const date = new Date();

    const params = {
      TableName: `${process.env.TABLE_NAME}-enroll`,
      Item: {
        city: this.enrollData.city.toLowerCase().trim(), // PK
        user: this.enrollData.user,
        motorcycle_brand:
          this.enrollData.motorcycle.brand.toLowerCase().trim() || "-",
        motorcycle_model:
          this.enrollData.motorcycle.model.toLowerCase().trim() || "-",
        motorcycle_use: this.enrollData.use.toLowerCase().trim() || "-",
        terms: {
          authorization: this.enrollData.terms.authorization || false,
          responsibility: this.enrollData.terms.responsibility,
          lgpd: this.enrollData.terms.lgpd,
        },
        enroll_status: "waiting",
        enroll_date: `${date.toLocaleString(
          "pt-BR"
        )}:${date.getMilliseconds()}`, // SK
        updated_at: `${date.toLocaleString("pt-BR")}:${date.getMilliseconds()}`,
        updated_by: "user",
        class: "none",
      },
    };
    await dynamoDbDoc.send(new PutCommand(params));
    this.enroll = params.Item;
    return this.enroll;
  }

  static validate(data, schema) {
    console.info("EnrollModel: validate");
    const ajv = new Ajv({ allErrors: true });
    const valid = ajv.validate(schema, data);
    if (!valid) {
      const missingProperty = ajv.errors.map((error) => {
        return error.instancePath + "/" + error.params.missingProperty;
      });
      throw CreateError[400]({
        message: `Missing property on enroll: ${missingProperty}`,
      });
    }
  }

  static async getById(enrollId) {
    console.info("EnrollModel: getById");
    const params = {
      TableName: `${process.env.TABLE_NAME}-enroll`,
      Key: {
        ...enrollId,
      },
    };
    const result = await dynamoDbDoc.send(new GetCommand(params));
    return result.Item;
  }

  static async updateEnrollStatusPlusClass(enroll, admin_username) {
    console.info("EnrollModel: updateEnrollStatusPlusClass");
    const date = new Date();
    const params = {
      TableName: `${process.env.TABLE_NAME}-enroll`,
      Key: {
        city: enroll.city,
        enroll_date: enroll.enroll_date,
      },
      ExpressionAttributeNames: {
        "#class": "class",
      },
      UpdateExpression:
        "set enroll_status = :enroll_status, updated_at = :updated_at, updated_by = :updated_by, #class = :class",
      ExpressionAttributeValues: {
        ":enroll_status": enroll.enroll_status,
        ":updated_at": `${date.toLocaleString(
          "pt-BR"
        )}:${date.getMilliseconds()}`,
        ":updated_by": admin_username,
        ":class": enroll.class,
      },
    };
    const result = await dynamoDbDoc.send(new UpdateCommand(params));
    if (process.env.ENV !== "production")
      console.info("result updateEnrollStatusPlusClass", result);
    return result.Item;
  }

  static async updateEnrollStatus(enroll, admin_username) {
    console.info("EnrollModel: updateEnrollStatus");
    const date = new Date();
    const params = {
      TableName: `${process.env.TABLE_NAME}-enroll`,
      Key: {
        city: enroll.city,
        enroll_date: enroll.enroll_date,
      },
      UpdateExpression:
        "set enroll_status = :enroll_status, updated_at = :updated_at, updated_by = :updated_by",
      ExpressionAttributeValues: {
        ":enroll_status": enroll.enroll_status,
        ":updated_at": `${date.toLocaleString(
          "pt-BR"
        )}:${date.getMilliseconds()}`,
        ":updated_by": admin_username,
      },
    };
    const result = await dynamoDbDoc.send(new UpdateCommand(params));
    if (process.env.ENV !== "production")
      console.info("result updateEnrollStatus", result);
    return result.Item;
  }

  async saveLegacy(userID, admin_username) {
    console.info("EnrollModelDb.saveLegacy");
    // Validate Enroll
    this.enrollData.user = userID;
    EnrollModelDb.validate(this.enrollData, EnrollLegacySchemaAjv);

    const date = new Date();

    const params = {
      TableName: `${process.env.TABLE_NAME}-enroll`,
      Item: {
        city: this.enrollData.city.toLowerCase().trim(), // PK
        user: this.enrollData.user,
        motorcycle_brand:
          this.enrollData.motorcycle.brand.toLowerCase().trim() || "-",
        motorcycle_model:
          this.enrollData.motorcycle.model.toLowerCase().trim() || "-",
        motorcycle_use: this.enrollData.use.toLowerCase().trim() || "-",
        terms: {
          authorization: this.enrollData.terms.authorization || false,
          responsibility: this.enrollData.terms.responsibility,
          lgpd: this.enrollData.terms.lgpd,
        },
        enroll_status: this.enrollData.enroll_status,
        enroll_date: this.enrollData.enroll_date, // SK
        updated_at: `${date.toLocaleString("pt-BR")}:${date.getMilliseconds()}`,
        updated_by: admin_username,
        class: this.enrollData.class,
      },
    };
    await dynamoDbDoc.send(new PutCommand(params));
    this.enroll = params.Item;
    return this.enroll;
  }

  static async get(limit, page, expression, attNames, attValues) {
    // https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Scan.html
    console.info("EnrollModel.get");
    const params = {
      TableName: `${process.env.TABLE_NAME}-enroll`,
      Limit: parseInt(limit),
      ExclusiveStartKey: page,
    };
    if (expression) {
      if (process.env.ENV !== "production")
        console.info("expression", expression);
      params.FilterExpression = expression;
    }
    if (attNames) {
      if (process.env.ENV !== "production") console.info("attNames", attNames);
      params.ExpressionAttributeNames = attNames;
    }
    if (attValues) {
      if (process.env.ENV !== "production")
        console.info("attValues", attValues);
      params.ExpressionAttributeValues = attValues;
    }
    if (page === undefined || page === 0) {
      delete params.ExclusiveStartKey;
    }
    return EnrollModelDb.scanParams(params);
  }

  static async getByClass(class_name) {
    // query using Index
    console.log("EnrollModel.getByClass");
    const params = {
      TableName: `${process.env.TABLE_NAME}-enroll`,
      IndexName: "Class",
      KeyConditionExpression: "#class = :class",
      ExpressionAttributeValues: {
        ":class": class_name,
      },
      ExpressionAttributeNames: {
        "#class": "class",
        "#user": "user",
      },
      ProjectionExpression: "#user, enroll_status, terms",
    };
    // https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/GettingStarted.Query.html
    const result = await dynamoDbDoc.send(new QueryCommand(params));
    return { Items: result.Items };
  }

  static async getByClassFull(class_name) {
    // query using Index
    console.log("EnrollModel.getByClassFull");
    const params = {
      TableName: `${process.env.TABLE_NAME}-enroll`,
      IndexName: "Class",
      KeyConditionExpression: "#class = :class",
      ExpressionAttributeValues: {
        ":class": class_name,
      },
      ExpressionAttributeNames: {
        "#class": "class",
      },
    };
    // https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/GettingStarted.Query.html
    const result = await dynamoDbDoc.send(new QueryCommand(params));
    return { Items: result.Items };
  }

  static async scanParams(params) {
    const result = await dynamoDbDoc.send(new ScanCommand(params));
    if (process.env.ENV !== "production") console.info("result", result);
    return { Items: result.Items, page: result.LastEvaluatedKey };
  }

  static async delete (ids) {
    const command = new DeleteCommand({
      TableName: `${process.env.TABLE_NAME}-enroll`,
      Key: {
        ...ids,
      },
    });
  
    const result = await dynamoDbDoc.send(command);
    return result;
  }
}

module.exports = { EnrollModelDb };
