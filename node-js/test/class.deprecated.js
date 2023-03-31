import chai from 'chai';
import chaiHttp from 'chai-http';
import productionEnvSetup from './utils/processEnvSetup.js';
import sinon from 'sinon';
import JWTMiddleware from '../src/middleware/jwt-middleware.js';
sinon.stub(JWTMiddleware.prototype, 'validateToken').callsFake(async (req, res, next) => next());
import app from "../src/api/app.js"; 

chai.use(chaiHttp);

const { expect } = chai;

describe('The /class GET endpoint on production', function () {

  before(() => {
    productionEnvSetup();
  });


  it('should ...', async () => {
    const response = await chai
      .request(app)
      .get('/class')
      .set('content-type', 'application/json')
      .set('access_token', 'not really an access token')
      .set('id_token', 'not really an id token');

    console.log(response);

    expect(true).to.equal(false); // FAIL
  });

});