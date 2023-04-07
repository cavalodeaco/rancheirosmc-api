const supertest = require("supertest");
const AWS = require("aws-sdk-mock");
const app = require("../src/api/app.js");

const request = supertest(app);

describe("The /login POST endpoint on production", function () {
  const tokens = {
    AccessToken: "access",
    IdToken: "id",
    RefreshToken: "refresh",
  };

  const originalEnv = process.env;

  beforeEach(() => {
    process.env = {
      ...originalEnv,
      ENV: "production",
      CLIENT_ID: "client_id",
    };

    AWS.mock("CognitoIdentityServiceProvider", "initiateAuth", {
      AuthenticationResult: tokens,
    });
  });

  afterEach(() => {
    process.env = originalEnv;
    AWS.restore("CognitoIdentityServiceProvider");
  });

  it("should return access, id and refresh tokens given user and password", async () => {
    const response = await request
      .post("/login")
      .set("content-type", "application/json")
      .set("Origin", "https://ppv-admin.lordriders.com")
      .send({ user: "foo", password: "bar" });

    expect(response.body.message).toEqual({
      access_token: tokens.AccessToken,
      id_token: tokens.IdToken,
      refresh_token: tokens.RefreshToken,
    });
  });
});
