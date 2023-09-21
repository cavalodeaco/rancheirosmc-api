const { dynamoDbDoc } = require("../libs/ddb-doc.js");
const {
  UpdateCommand,
  PutCommand,
  GetCommand,
  ScanCommand,
  QueryCommand,
  DeleteCommand,
} = require("@aws-sdk/lib-dynamodb");
const Ajv = require("ajv");
const CreateError = require("http-errors");
const crypto = require("crypto");

const UserSchemaAjv = {
  type: "object",
  properties: {
    name: { type: "string" },
    email: { type: "string" },
    phone: { type: "string" },
    driverLicense: { type: "string" },
    driverLicenseUF: { type: "string" },
  },
  required: ["name", "email", "phone", "driverLicense", "driverLicenseUF"],
  additionalProperties: false,
};

const UserLegacySchemaAjv = {
  type: "object",
  properties: {
    created_at: { type: "string" },
    name: { type: "string" },
    email: { type: "string" },
    phone: { type: "string" },
    driverLicense: { type: "string" },
    driverLicenseUF: { type: "string" },
  },
  required: [
    "name",
    "email",
    "phone",
    "driverLicense",
    "driverLicenseUF",
    "created_at",
  ],
  additionalProperties: false,
};

const regex_DL = /\d+/g;
const regex_email = /([^\s@]+@[^\s@]+\.[^\s@]+)/g;

class UserModelDb {
  constructor(userData) {
    this.userData = userData;
    this.user = null;
  }

  capitalizeName(name) {
    console.info("UserModelDb.capitalizeName");
    let words = name.toLowerCase().split(" ");
    let capitalizedWords = words.map(function (word) {
      return word.charAt(0).toUpperCase() + word.slice(1);
    });
    return capitalizedWords.join(" ");
  }

  // Clear data
  clearData() {
    console.info("UserModelDb.clearData");
    this.userData.driverLicense = this.userData.driverLicense
      .match(regex_DL)
      .join("");
    this.userData.driverLicenseUF = this.userData.driverLicenseUF.toUpperCase();
    const emails = this.userData.email.match(regex_email);
    this.userData.email = emails ? emails[0] : "";
    this.userData.phone = this.userData.phone?.replace(/\D/g, "") || "";
    // clear numbers from name
    this.userData.name = this.capitalizeName(
      this.userData.name.replace(/\d+/g, "")
    );
  }

  async save() {
    console.info("UserModelDb.save");

    // Validate User
    UserModelDb.validate(this.userData, UserSchemaAjv);
    this.clearData();
    const date = new Date();

    const params = {
      TableName: `${process.env.TABLE_NAME}-user`,
      Item: {
        name: this.userData.name,
        email: this.userData.email,
        phone: this.userData.phone,
        driver_license: this.userData.driverLicense, // SK
        driver_license_UF: this.userData.driverLicenseUF, // PK
        enroll: [],
        created_at: `${date.toLocaleString("pt-BR")}:${date.getMilliseconds()}`,
        updated_at: `${date.toLocaleString("pt-BR")}:${date.getMilliseconds()}`,
        updated_by: "user",
      },
      ReturnValues: "NONE",
      ConditionExpression:
        "attribute_not_exists(driver_license_UF) AND attribute_not_exists(driver_license)", // blocks double users
    };
    try {
      console.info("Creating new user!");
      await dynamoDbDoc.send(new PutCommand(params));
      return "created";
    } catch {
      return "exists";
    }
  }

  // update user adding the enrollment
  async update(enroll) {
    console.info("UserModelDb.update");
    const params = {
      TableName: `${process.env.TABLE_NAME}-user`,
      Key: {
        driver_license: this.userData.driverLicense,
        driver_license_UF: this.userData.driverLicenseUF,
      },
      UpdateExpression: "set enroll = :enroll",
      ExpressionAttributeValues: {
        ":enroll": enroll,
      },
    };
    await dynamoDbDoc.send(new UpdateCommand(params));
  }

  static validate(data, schema) {
    console.info("UserModelDb.validate");
    const ajv = new Ajv({ allErrors: true });
    const valid = ajv.validate(schema, data);
    if (!valid) {
      const missingProperty = ajv.errors.map((error) => {
        return error.instancePath + "/" + error.params.missingProperty;
      });
      throw CreateError[400]({
        message: `Missing property on user: ${missingProperty}`,
      });
    }
  }

  static async get(limit, page) {
    console.info("UserModelDb.get");
    const params = {
      TableName: `${process.env.TABLE_NAME}-user`,
      Limit: parseInt(limit),
      ExclusiveStartKey: page,
    };
    const result = await dynamoDbDoc.send(new QueryCommand(params));
    if (process.env.ENV !== "production") console.info("result", result);
    return { Items: result.Items, page: result.LastEvaluatedKey };
  }

  static async getById(ids) {
    console.info("UserModelDb.getById");
    const params = {
      TableName: `${process.env.TABLE_NAME}-user`,
      Key: {
        ...ids,
      },
    };
    const result = await dynamoDbDoc.send(new GetCommand(params));
    return result.Item;
  }

  static async delete(ids) {
    const command = new DeleteCommand({
      TableName: `${process.env.TABLE_NAME}-user`,
      Key: {
        ...ids,
      },
    });

    const result = await dynamoDbDoc.send(command);
    return result;
  }
}

module.exports = { UserModelDb };
