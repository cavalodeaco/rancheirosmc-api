import axios from 'axios';
import jwkToPem from 'jwk-to-pem';
import jwt from 'jsonwebtoken';
import Ajv from 'ajv';

const TokenSchema = {
    type: "object",
    properties: {
        token: {
            type: "object",
            properties: {
                access_token: { type: "string" },
                id_token: { type: "string" }
            },
            required: ["access_token", "id_token"]
        },
    },
    required: ["token"],
    additionalProperties: true
}

class JWTMiddleware {
    async validateToken(req, res, next) {
        // validate body
        try {
            // Validade main structure
            const ajv = new Ajv({ allErrors: true })
            const valid = ajv.validate(TokenSchema, req.body);
            if (!valid) {
                const missingProperty = ajv.errors.map((error) => {
                    return error.instancePath + '/' + error.params.missingProperty;
                });
                throw missingProperty;
            }
        } catch (error) {
            console.log(error);
            throw { message: "Invalid JSON: " + error.message, status: 400 }; // Bad Request
        }

        const { access_token, id_token } = req.body.token;
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
        var decodedAccessJwt = jwt.decode(access_token, { complete: true });
        if (!decodedAccessJwt) {
            throw { message: "Not a valid Access JWT token", status: 401 };
        }
        // #1 check token expiration
        var currentTs = Math.floor(new Date() / 1000);
        if (currentTs > decodedAccessJwt.payload.exp) {
            throw { message: "Token expired", status: 401 };
        }
        // #2 check audience
        var decodedIdJwt = jwt.decode(id_token, { complete: true });
        if (!decodedIdJwt) {
            throw { message: "Not a valid Id JWT token", status: 401 };
        }
        if (decodedIdJwt.payload.aud !== process.env.CLIENT_ID || decodedAccessJwt.payload.client_id !== process.env.CLIENT_ID) {
            throw { message: "Token was not issued for this audience", status: 401 };
        }
        // #3 check issuer
        const cognitoIssuer = `https://cognito-idp.${process.env.AWS_REGION}.amazonaws.com/${process.env.USER_POOL_ID}`;
        if (decodedIdJwt.payload.iss !== cognitoIssuer || decodedAccessJwt.payload.iss !== cognitoIssuer) {
            throw { message: "Token was not issued by this issuer", status: 401 };
        }
        // #4 check token_use
        if (decodedAccessJwt.payload.token_use !== "access") {
            throw { message: "Token was not an access token", status: 401 };
        }
        if (decodedIdJwt.payload.token_use !== "id") {
            throw { message: "Token was not an id token", status: 401 };
        }
        // download tokens
        const pems = await axios.get(`${cognitoIssuer}/.well-known/jwks.json`)
            .then(function (response) {
                var pems = {};
                var keys = response.data['keys'];
                for (var i = 0; i < keys.length; i++) {
                    // Convert each key to PEM
                    var key_id = keys[i].kid;
                    var modulus = keys[i].n;
                    var exponent = keys[i].e;
                    var key_type = keys[i].kty;
                    var jwk = { kty: key_type, n: modulus, e: exponent };
                    var pem = jwkToPem(jwk);
                    pems[key_id] = pem;
                }
                return pems;
            })
            .catch(function (error) {
                // handle error
                return undefined;
            });
        if (!pems) {
            throw { message: "Internal Server Error: PEMS", status: 500 };
        }
        // validate the token
        var kid = decodedAccessJwt.header.kid;
        var pem = pems[kid];
        if (!pem) {
            throw { message: "Invalid token", status: 422 };
        }

        const verify = jwt.verify(access_token, pem, function (err, payload) {
            if (err) {
                throw { message: "Invalid token", status: 422 };
            } else {
                return true;
            }
        });

        if (verify) {
            next();
        }
    }
}
export default JWTMiddleware;