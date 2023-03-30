import chai from 'chai';
import chaiHttp from 'chai-http';
import AWS from 'aws-sdk-mock';
import app from "../src/api/app.js";

chai.use(chaiHttp);

const { expect } = chai;

describe('The /login POST endpoint on production', function () {

  process.env.ENV = 'production';
  process.env.CLIENT_ID = 'client_id';

  const tokens = {
    AccessToken: "not really an access token",
    IdToken: "not really an id token",
    RefreshToken: 'not really an refresh token'
  };

  AWS.mock('CognitoIdentityServiceProvider', 'initiateAuth', {
    AuthenticationResult: tokens,
  });

  it('should return access, id and refresh tokens given user and password', async () => {
    const response = await chai
      .request(app)
      .post('/login')
      .set('content-type', 'application/json')
      .send({ user: 'foo', password: 'bar' });

    expect(response.body.message).to.deep.equal({
      access_token: tokens.AccessToken,
      id_token: tokens.IdToken,
      refresh_token: tokens.RefreshToken
    });
  });
});
