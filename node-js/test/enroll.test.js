const supertest = require("supertest");
const { mockClient } = require("aws-sdk-client-mock");
const { DynamoDBDocumentClient, GetCommand } = require("@aws-sdk/lib-dynamodb");
const ddbMock = mockClient(DynamoDBDocumentClient);
const app = require("../src/api/app.js");
const request = supertest(app);

describe('The /enroll POST endpoint on production', function () {

  beforeEach(() => {
    ddbMock.reset();
  });

  it('should enroll student to waiting list', async () => {
    const user = {
      name: 'Jackson Teller',
      email: 'jack@sons.com',
      phone: '(41) 99876-5432',
      driverLicense: '1234567890',
      driverLicenseUF: 'PR',
    };
    const enroll = {
      city: "curitiba",
      motorcycle: {
        brand: 'Royal Enfield',
        model: 'Himalayan',
      },
      use: '',
      terms: {
        authorization: true,
        responsibility: false,
        lgpd: false,
      },
    };

    const date = new Date();

    ddbMock.on(GetCommand).resolves({
      Item: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        driver_license: user.driverLicense, // SK
        driver_license_UF: user.driverLicenseUF, // PK
        enroll: [],
        created_at: `${date.toLocaleString("pt-BR")}:${date.getMilliseconds()}`,
        updated_at: `${date.toLocaleString("pt-BR")}:${date.getMilliseconds()}`,
        updated_by: "user"
      },
    });

    const {status, body} = await request
      .post('/enroll')
      .set('content-type', 'application/json')
      .send({user, enroll});

    expect(status).toEqual(201);
    expect(body.message).toMatch('enrolled');
  });

});
