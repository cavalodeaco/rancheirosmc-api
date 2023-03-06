import dotenv from 'dotenv';
dotenv.config()
import AmazonCognitoIdentity from "amazon-cognito-identity-js";
import global from "node-fetch";
/*
Reason for importding node-fetch to global.fetch is because of amazon-cognito-identity-js package. It’s a javascript library meant for web browser and it uses fetch in library. Since nodejs don’t have fetch in built we have to emulate it like that.
*/

const poolData = {    
    UserPoolId : process.env.USER_POOL_ID, // Your user pool id here
    ClientId : process.env.CLIENT_ID // Your client id here
    }; 
const pool_region = process.env.AWS_REGION;

const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

function RegisterUser(){
    var attributeList = [];
    attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({Name:"name",Value:"teste"}));
    attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({Name:"preferred_username",Value:"teste"}));
    attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({Name:"gender",Value:"female"}));
    attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({Name:"birthdate",Value:"1996-11-11"}));
    attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({Name:"address",Value:"Teste"}));
    attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({Name:"email",Value:"teste@gmail.com"}));
    attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({Name:"phone_number",Value:"+2343434343"}));

    userPool.signUp('teste@gmail.com', 'teste12345', attributeList, null, function(err, result){
        if (err) {
            console.log(err);
            return;
        }
        console.log('user name is ' + JSON.stringify(result.user) );
    });
}

// function Login() {
//     var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
//         Username : 'teste@gmail.com',
//         Password : 'teste12345',
//     });

//     var userData = {
//         Username : 'teste@gmail.com',
//         Pool : userPool
//     };
//     var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
//     cognitoUser.authenticateUser(authenticationDetails, {
//         onSuccess: function (result) {
//             console.log('access token + ' + result.getAccessToken().getJwtToken());
//             console.log('id token + ' + result.getIdToken().getJwtToken());
//             console.log('refresh token + ' + result.getRefreshToken().getToken());
//         },
//         onFailure: function(err) {
//             console.log(err);
//         },

//     });

// }

RegisterUser();
// Login();