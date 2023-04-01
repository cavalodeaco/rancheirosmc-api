const axios = require("axios");
jest.mock("axios");

axios.get.mockResolvedValueOnce({
  data: {
    keys: []
  }
});

const tokens = {
  access_token: "access",
  id_token: "id",
  refresh_token: 'refresh',
};

process.env = {
  ...process.env,
  CLIENT_ID: 'client_id',
  AWS_REGION: 'us-east-1',
  USER_POOL_ID: 'POOL_ID',
};

function loginMock(mockPayload) {
  jest.mock('jsonwebtoken', () => ({
    ...jest.requireActual('jsonwebtoken'),
    decode: (token) => ({
      payload: {
        ...mockPayload,
        exp: Infinity, // never expires
        aud: process.env.CLIENT_ID,
        client_id: process.env.CLIENT_ID,
        iss: `https://cognito-idp.${process.env.AWS_REGION}.amazonaws.com/${process.env.USER_POOL_ID}`,
        token_use: token,
      },
      header: {
        kid: 'constructor', // or any other object prototype attribute making the empty object pems[kid] to be valid
      },
    }),
    verify: () => { },
  }));
  return tokens;
}

module.exports = loginMock;
