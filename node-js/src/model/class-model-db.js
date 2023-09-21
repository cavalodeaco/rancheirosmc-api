const { QueryCommand } = require("@aws-sdk/client-dynamodb");
const { dynamoDbDoc } = require("../libs/ddb-doc.js");
const {
  PutCommand,
  ScanCommand,
  GetCommand,
  UpdateCommand,
} = require("@aws-sdk/lib-dynamodb");
const Ajv = require("ajv");
const CreateError = require("http-errors");

const ClassSchemaAjv = {
  type: "object",
  properties: {
    name: { type: "string" },
    city: { type: "string" },
    location: { type: "string" },
    date: { type: "string" },
  },
  required: ["name", "city", "location", "date"],
  additionalProperties: false,
};

class ClassModelDb {
  constructor(classData) {
    this.classData = classData;
    this.classData.name = `MPV ${this.classData.date} (${this.classData.city})`;
  }

  async save(admin_username) {
    console.info("ClassModelDb.save");

    // Validate Class
    ClassModelDb.validate(this.classData);
    const date = new Date();

    const params = {
      TableName: `${process.env.TABLE_NAME}-class`,
      Item: {
        name: this.classData.name, // index
        city: this.classData.city, // PK
        location: this.classData.location,
        date: this.classData.date, // SK
        active: "true", // index
        created_at: `${date.toLocaleString("pt-BR")}:${date.getMilliseconds()}`,
        updated_at: `${date.toLocaleString("pt-BR")}:${date.getMilliseconds()}`,
        updated_by: admin_username, // index
      },
      ReturnValues: "NONE",
      ConditionExpression:
        "attribute_not_exists(city) AND attribute_not_exists(date)", // blocks double classes
    };
    try {
      await dynamoDbDoc.send(new PutCommand(params));
      return "created";
    } catch {
      throw CreateError[409]({ message: "Class already exist!" });
    }
  }

  static async getById(classId) {
    console.info("ClassModelDb.getById");
    const params = {
      TableName: `${process.env.TABLE_NAME}-class`,
      Key: {
        ...classId,
      },
    };
    const result = await dynamoDbDoc.send(new GetCommand(params));
    return result.Item;
  }

  static async update(class_data, admin_username) {
    console.info("ClassModelDb.update");
    const date = new Date();
    const params = {
      TableName: `${process.env.TABLE_NAME}-class`,
      Key: {
        city: class_data.city,
        date: class_data.date,
      },
      UpdateExpression:
        "set active = :active, #location = :location, updated_at = :updated_at, updated_by = :updated_by",
      ExpressionAttributeNames: {
        "#location": "location",
      },
      ExpressionAttributeValues: {
        ":location": class_data.location,
        ":active": class_data.active,
        ":updated_at": `${date.toLocaleString(
          "pt-BR"
        )}:${date.getMilliseconds()}`,
        ":updated_by": admin_username,
      },
    };
    const result = await dynamoDbDoc.send(new UpdateCommand(params));
    console.info("result updateLocation", result);
    return result.Item;
  }

  static validate(data) {
    console.info("ClassModelDb.validate");
    const ajv = new Ajv({ allErrors: true });
    const valid = ajv.validate(ClassSchemaAjv, data);
    if (!valid) {
      const missingProperty = ajv.errors.map((error) => {
        return error.instancePath + "/" + error.params.missingProperty;
      });
      throw CreateError[400]({
        message: `Missing property on class: ${missingProperty}`,
      });
    }
  }

  static async get(limit, page, expression, attNames, attValues) {
    console.info("ClassModelDb.get");
    const params = {
      TableName: `${process.env.TABLE_NAME}-class`,
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
    const result = await dynamoDbDoc.send(new QueryCommand(params));
    if (process.env.ENV !== "production") console.info("result", result);
    return { Items: result.Items, page: result.LastEvaluatedKey };
  }
}

module.exports = { ClassModelDb };
