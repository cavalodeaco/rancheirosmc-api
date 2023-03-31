const axios = require("axios");
jest.mock("axios");

axios.get.mockResolvedValueOnce({
  data: {
    keys: []
  }
});

let JWTMiddleware;

describe('The JWTMiddleware.validateToken method on production', function () {

  const originalEnv = process.env;

  const tokens = {
    AccessToken: "access",
    IdToken: "id",
    RefreshToken: 'refresh',
  };

  beforeEach(() => {
    process.env = {
      ...originalEnv,
      ENV: 'production',
      CLIENT_ID: 'client_id',
      AWS_REGION: 'us-east-1',
      USER_POOL_ID: 'POOL_ID',
    };

    jest.mock('jsonwebtoken', () => {
      const originalModule = jest.requireActual('jsonwebtoken');
      return ({
        ...originalModule,
        decode: (token) => ({
          payload: {
            exp: Infinity, // never expires
            aud: process.env.CLIENT_ID,
            client_id: process.env.CLIENT_ID,
            iss: `https://cognito-idp.${process.env.AWS_REGION}.amazonaws.com/${process.env.USER_POOL_ID}`,
            token_use: token,
          },
          header: {
            kid: 'constructor', // or any other object prototype attribute making the empty object pems[kid] to be valid
          }
        }),
        verify: () => { },
      })
    });

    JWTMiddleware = require('../src/middleware/jwt-middleware');

  });

  afterEach(() => {
    process.env = originalEnv;
    jest.mock('jsonwebtoken', () => jest.requireActual('jsonwebtoken'));
  });

  it('should run without exceptions and call next for a successful auth', async () => {
    const req = {
      headers: {
        id_token: tokens.IdToken,
        access_token: tokens.AccessToken,
      },
    };
    const nextReturn = await new JWTMiddleware().validateToken(req, undefined, () => "SUCCESS");
    expect(nextReturn).toBe('SUCCESS');
  });

  it('should throw an exceptions if tokens not in request header', async () => {
    try {
      await new JWTMiddleware().validateToken({ headers: {} }, undefined, () => { });
    } catch ({ message }) {
      expect(message.message).toMatch(/No tokens found/);
    }
  });

});