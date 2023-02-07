// Import required modules
import { send, SUCCESS, FAILED } from 'cfn-response';
import { CognitoIdentityServiceProvider } from 'aws-sdk';

// FUNCTION: Lambda Handler
export function lambda_handler(event, context) {
  console.log("Request received:\n" + JSON.stringify(event));

  // Read data from input parameters
  let userPoolId = event.ResourceProperties.UserPoolId;
  let userPoolClientId = event.ResourceProperties.UserPoolClientId;

  // Set physical ID
  let physicalId = `${userPoolId}-${userPoolClientId}-secret`;

  let errorMessage = `Error at getting secret from cognito user pool client:`;
  try {
    let requestType = event.RequestType;
    if(requestType === 'Create') {
      console.log(`Request is of type '${requestType}'. Get secret from cognito user pool client.`);

      // Get secret from cognito user pool client
      let cognitoIdp = new CognitoIdentityServiceProvider();
      cognitoIdp.describeUserPoolClient({
        UserPoolId: userPoolId,
        ClientId: userPoolClientId
      }).promise()
      .then(result => {
        let secret = result.UserPoolClient.ClientSecret;
        send(event, context, SUCCESS, {Status: SUCCESS, Error: 'No Error', Secret: secret}, physicalId);
      }).catch(error => {
        // Error
        console.log(`${errorMessage}:${error}`);
        send(event, context, FAILED, {Status: FAILED, Error: error}, physicalId);
      });

    } else {
      console.log(`Request is of type '${requestType}'. Not doing anything.`);
      send(event, context, SUCCESS, {Status: SUCCESS, Error: 'No Error'}, physicalId);
    }
  } catch (error){
      // Error
      console.log(`${errorMessage}:${error}`);
      send(event, context, FAILED, {Status: FAILED, Error: error}, physicalId); 
  }
}  