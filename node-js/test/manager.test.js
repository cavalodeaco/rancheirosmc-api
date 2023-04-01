const supertest = require("supertest");

const loginMock = require('./mocks/login.mock');

const tokens = loginMock({
  "custom:manager": "true",
  "custom:caller": "true",
  "preferred_username": "user",
});

const app = require("../src/api/app.js");
const request = supertest(app);


describe('The /manager/call POST endpoint on production', function () {

  it.todo('should ...');
  // it('should...', async () => {

  //   const { status, body } = await request
  //     .post('/manager/call')
  //     .set('content-type', 'application/json')
  //     .set('access_token', tokens.access_token)
  //     .set('id_token', tokens.id_token)
  //     .set('refresh_token', tokens.refresh_token)
  //     .send({});

  //   console.table([status, body]);

  //   expect(true).toBe(true);

  // });


});
