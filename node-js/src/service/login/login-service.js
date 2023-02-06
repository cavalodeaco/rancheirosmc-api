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

    async getToken(data) {
        console.log("data received: " + JSON.stringify(data));
        // authenticate via AWS cognito and return tokens
        // validate data
        try {
            this.validateJson(data);
        } catch (err) {
            console.log("validation failed: " + err.message || JSON.stringify(err));
            return "failed", err;
        }

        // authenticate
        try {
            const {tokens, err} = await this.authenticateCognito(data);
            console.log("tokens: " + JSON.stringify(tokens));
            if (err !== null)
                throw new Error(err);
            return "logged", tokens;
        } catch (err) {
            console.log("authentication failed: " + err.message || JSON.stringify(err));
            return "failed", err;
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
        
            return {tokens: {"access_token": response.AuthenticationResult.AccessToken,
                    "id_token": response.AuthenticationResult.IdToken,
                    "refresh_token": response.AuthenticationResult.RefreshToken}, err:null}
          } catch (error) {
            console.error(error);
            return null, error.message || JSON.stringify(error);
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