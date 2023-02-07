import Ajv from 'ajv';
import AWS from 'aws-sdk';

const SignInSchema = {
    type: "object",
    properties: {
        user: { type: "string" },
        password: { type: "string" }
    },
    required: ["user", "password"],
    additionalProperties: false
}

class LoginService {
    async getToken(params) {
        // authenticate via AWS cognito and return tokens
        // validate data
        try {
            this.validateJson(params);
        } catch (err) {
            throw err;
        }

        // authenticate
        try {
            return await this.authenticateCognito(params);
        } catch (err) {
            throw err;
        }
    }

    async authenticateCognito(data) {

        // Initialize the AWS Cognito Identity Provider
        const cognitoIdentityServiceProvider = new AWS.CognitoIdentityServiceProvider({
            region: process.env.AWS_REGION,
        });

        const params = {
            AuthFlow: 'USER_PASSWORD_AUTH',
            ClientId: process.env.CLIENT_ID,
            AuthParameters: {
                USERNAME: data.user,
                PASSWORD: data.password
            },
        };

        try {
            // Call the initiateAuth method to authenticate the user and retrieve the tokens
            const response = await cognitoIdentityServiceProvider.initiateAuth(params).promise();

            return {
                    "access_token": response.AuthenticationResult.AccessToken,
                    "id_token": response.AuthenticationResult.IdToken,
                    "refresh_token": response.AuthenticationResult.RefreshToken
                }
        } catch (err) {
            throw err;
        }
    }

    validateJson(data) {
        // Validade main structure
        const ajv = new Ajv({ allErrors: true })
        const valid = ajv.validate(SignInSchema, data);
        if (!valid) {
            const missingProperty = ajv.errors.map((error) => {
                return error.instancePath + '/' + error.params.missingProperty;
            });
            throw {status: 422, message: "Invalid JSON: "+missingProperty};
        }
    }
};

export default LoginService;