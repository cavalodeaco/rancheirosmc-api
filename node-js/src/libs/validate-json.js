const Ajv = require("ajv");
const CreateError = require("http-errors");

const validateJson = (data, schema) => {
  console.info("validateJson");
  try {
    // Validade main structure
    const ajv = new Ajv({ allErrors: true });
    const valid = ajv.validate(schema, data);
    if (!valid) {
      const mp = ajv.errors.map((error) => {
        return error.params.missingProperty;
      });
      throw CreateError[400]({ message: `Missing property on body: ${mp}` });
    }
  } catch (err) {
    throw CreateError[500]({
      message: "Error to validate body: " + JSON.stringify(err),
    });
  }
};

module.exports = validateJson;
