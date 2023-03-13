import axios from 'axios';
import jwkToPem from 'jwk-to-pem';
import jwt from 'jsonwebtoken';
import CreateError from 'http-errors';

class JWTMiddleware {
    async validateToken(req, res, next) {
        console.log("Validating token...");
        if (process.env.ENV === 'local')
            return next();
        if (!req.headers.id_token || !req.headers.access_token) {
            throw CreateError[400]({message:'No tokens found'});
        }
        const access_token = req.headers.access_token;
        const id_token = req.headers.id_token;
        /*
            To verify JWT claims
            1- Verify that the token is not expired.
            2- The aud claim in an ID token and the client_id claim in an access token should match the app client ID that was created in the Amazon Cognito user pool.
            3- The issuer (iss) claim should match your user pool. For example, a user pool created in the us-east-1 Region will have the following iss value:
                https://cognito-idp.us-east-1.amazonaws.com/<userpoolID>.
            4- Check the token_use claim.
                1- If you are only accepting the access token in your web API operations, its value must be access.
                2- If you are only using the ID token, its value must be id.
                3- If you are using both ID and access tokens, the token_use claim must be either id or access.
            # You can now trust the claims inside the token.
        */
        // decode token
        let decodedAccessJwt = jwt.decode(access_token, { complete: true });
        if (!decodedAccessJwt) {
            throw CreateError[401]({message:'Not a valid Access JWT token'});
        }
        // #1 check token expiration
        let currentTs = Math.floor(new Date() / 1000);
        if (currentTs > decodedAccessJwt.payload.exp) {
            throw CreateError[401]({message:'Token expired'});
        }
        // #2 check audience
        let decodedIdJwt = jwt.decode(id_token, { complete: true });
        if (!decodedIdJwt) {
            throw CreateError[401]({message:'Not a valid Id JWT token'});
        }
        if (decodedIdJwt.payload.aud !== process.env.CLIENT_ID || decodedAccessJwt.payload.client_id !== process.env.CLIENT_ID) {
            throw CreateError[401]({message:'Token was not issued for this audience'}); 
        }
        // #3 check issuer
        const cognitoIssuer = `https://cognito-idp.${process.env.AWS_REGION}.amazonaws.com/${process.env.USER_POOL_ID}`;
        if (decodedIdJwt.payload.iss !== cognitoIssuer || decodedAccessJwt.payload.iss !== cognitoIssuer) {
            throw CreateError[401]({message:'Token was not issued by this issuer'});
        }
        // #4 check token_use
        if (decodedAccessJwt.payload.token_use !== "access") {
            throw CreateError[401]({message:'Token was not an access token'});
        }
        if (decodedIdJwt.payload.token_use !== "id") {
            throw CreateError[401]({message:'Token was not an id token'});
        }
        // download tokens
        const pems = await axios.get(`${cognitoIssuer}/.well-known/jwks.json`)
            .then(function (response) {
                let pems = {};
                let keys = response.data['keys'];
                for (let i = 0; i < keys.length; i++) {
                    // Convert each key to PEM
                    let key_id = keys[i].kid;
                    let modulus = keys[i].n;
                    let exponent = keys[i].e;
                    let key_type = keys[i].kty;
                    let jwk = { kty: key_type, n: modulus, e: exponent };
                    let pem = jwkToPem(jwk);
                    pems[key_id] = pem;
                }
                return pems;
            })
            .catch(function (error) {
                // handle error
                throw CreateError[500]({message:'Internal Server Error: PEMS'});
            });
        // validate the token
        let kid = decodedAccessJwt.header.kid;
        let pem = pems[kid];
        if (!pem) {
            throw CreateError[401]({message:'Invalid token'});
        }

        jwt.verify(access_token, pem, function (err, payload) {
            if (err) {
                throw CreateError[401]({message:'Invalid token'});
            }
        });

        console.log("Access token is valid");
        return next();
    }
}

export default JWTMiddleware;