const Ajv = require("ajv");
const AWS = require("aws-sdk");
const CreateError = require("http-errors");

const SignInSchema = {
  type: "object",
  properties: {
    user: { type: "string" },
    password: { type: "string" },
  },
  required: ["user", "password"],
  additionalProperties: false,
};

class LoginService {
  async getToken(params) {
    console.info("LoginService.getToken");
    // authenticate via AWS cognito and return tokens
    // validate data
    this.validateJson(params);

    // authenticate
    return await this.authenticateCognito(params);
  }

  async authenticateCognito(data) {
    console.info("LoginService.authenticateCognito");
    // Initialize the AWS Cognito Identity Provider
    const cognitoIdentityServiceProvider =
      new AWS.CognitoIdentityServiceProvider({
        region: process.env.AWS_REGION,
      });

    const params = {
      AuthFlow: "USER_PASSWORD_AUTH",
      ClientId: process.env.CLIENT_ID,
      AuthParameters: {
        USERNAME: data.user,
        PASSWORD: data.password,
      },
    };

    // Call the initiateAuth method to authenticate the user and retrieve the tokens
    const response = await cognitoIdentityServiceProvider
      .initiateAuth(params)
      .promise();

    return {
      access_token: response.AuthenticationResult.AccessToken,
      id_token: response.AuthenticationResult.IdToken,
      refresh_token: response.AuthenticationResult.RefreshToken,
    };
  }

  validateJson(data) {
    console.info("LoginService.validateJson");
    // Validade main structure
    const ajv = new Ajv({ allErrors: true });
    const valid = ajv.validate(SignInSchema, data);
    if (!valid) {
      const missingProperty = ajv.errors.map((error) => {
        return error.instancePath + "/" + error.params.missingProperty;
      });
      throw CreateError[422]({ message: "Invalid JSON: " + missingProperty });
    }
  }
}

module.exports = LoginService;
