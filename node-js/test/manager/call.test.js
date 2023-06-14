const supertest = require("supertest");
const { mockClient } = require("aws-sdk-client-mock");
const {
  DynamoDBDocumentClient,
  GetCommand,
  UpdateCommand,
} = require("@aws-sdk/lib-dynamodb");
const ddbMock = mockClient(DynamoDBDocumentClient);
const loginMock = require("../mocks/login.mock");

const tokens = loginMock({
  "custom:manager": "true",
  "custom:caller": "true",
  preferred_username: "user",
});

const app = require("../../src/api/app.js");
const request = supertest(app);

describe("The /manager/call POST endpoint on production", function () {
  const enroll = {
    user: {
      driver_license_UF: "1234567890",
      driver_license: "PR",
    },
    city: "cambira",
    enroll_date: `31/03/2023 01:23:45:6789`,
    motorcycle: { brand: "Royal Enfield", model: "Himalayan" },
    use: "",
    terms: {
      authorization: true,
      responsibility: false,
      lgpd: false,
    },
  };

  process.env = {
    ...process.env,
    ENV: "production",
  };

  beforeEach(() => {
    ddbMock.reset();
  });

  it("should call enrolls from the waiting list given class and an enroll list", async () => {
    ddbMock
      .on(GetCommand, { TableName: `${process.env.TABLE_NAME}-class` })
      .resolves({
        Item: {
          name: "PPV 15/04/2023 (cambira)",
          city: "cambira",
          location: "https://goo.gl/maps/yBWLseFvPz88wzQA7",
          date: "15/04/2023",
        },
      })
      .on(GetCommand, { TableName: `${process.env.TABLE_NAME}-enroll` })
      .resolves({
        Item: { enroll_status: "waiting", ...enroll },
      })
      .on(UpdateCommand, { TableName: `${process.env.TABLE_NAME}-enroll` })
      .resolves({
        Item: { enroll_status: "called", ...enroll },
      });

    const {
      status,
      body,
    } = await request
      .post("/manager/call")
      .set("content-type", "application/json")
      .set("Origin", "https://admin.rancheirosmc.com.br")
      .set("access_token", tokens.access_token)
      .set("id_token", tokens.id_token)
      .set("refresh_token", tokens.refresh_token)
      .send({
        enrolls: [
          {
            city: "cambira",
            enroll_date: `31/03/2023 01:23:45:6789`,
          },
        ],
        class_name: "PPV 15/04/2023 (cambira)",
      });

    expect(status).toEqual(200);
    expect(body[0].status).toMatch(/success/);
    expect(body[0].enroll.enroll_status).toMatch(/called/);
  });
});
