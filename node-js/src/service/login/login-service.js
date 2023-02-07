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
            return { status: 433, data: err.message || JSON.stringify(err) }
        }

        // authenticate
        try {
            const { status, data } = await this.authenticateCognito(params);
            return { status, data };
        } catch (err) {
            return { status: 500, data: "Internal Server Error: " + err.message || JSON.stringify(err) }
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
                status: 200, data: {
                    "access_token": response.AuthenticationResult.AccessToken,
                    "id_token": response.AuthenticationResult.IdToken,
                    "refresh_token": response.AuthenticationResult.RefreshToken
                }
            }
        } catch (err) {
            console.error(err.name);
            if (err.name == "NotAuthorizedException") {
                return { status: 422, data: err.message || JSON.stringify(err) };
            } else if (err.name == "UserNotFoundException") {
                return { status: 422, data: err.message || JSON.stringify(err) };
            }
            return { status: 500, data: "Internal Server Error: " + err.message || JSON.stringify(err) };
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
            throw missingProperty;
        }
    }
};

export default LoginService;