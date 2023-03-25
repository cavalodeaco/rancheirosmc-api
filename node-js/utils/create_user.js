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
    attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({Name:"name",Value:"posclass"}));
    attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({Name:"preferred_username",Value:"teste"}));
    attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({Name:"custom:caller",Value:"false"})); /// who calls the students
    attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({Name:"custom:cambira",Value:"true"}));
    attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({Name:"custom:curitiba",Value:"false"}));
    attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({Name:"custom:download",Value:"false"})); // baixa dados de turma
    attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({Name:"custom:londrina",Value:"true"}));
    attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({Name:"custom:manager",Value:"false"}));
    attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({Name:"custom:manage_class",Value:"false"}));
    attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({Name:"custom:maringa",Value:"true"}));
    attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({Name:"custom:medianeira",Value:"true"}));
    attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({Name:"custom:posclass",Value:"true"})); // quem gerencia falta e certificado
    attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({Name:"custom:viewer",Value:"true"}));
    attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({Name:"email",Value:"teste5@gmail.com"}));
    attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({Name:"phone_number",Value:"+2343434343"}));

    userPool.signUp('teste5@gmail.com', 'teste12345', attributeList, null, function(err, result){
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