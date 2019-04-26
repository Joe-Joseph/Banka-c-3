import chai from 'chai';
import chaiHttp from 'chai-http';
import jwt from 'jsonwebtoken';
import app from '../app';

const { expect } = chai;
chai.use(chaiHttp);
const payload = {
  id: 1,
  firstName: 'Nkurunziza',
  lastName: 'Joseph',
  email: 'joseph@gmail.com',
  isAdmin: 'true',
  type: 'admin',
};

const token = jwt.sign(payload, 'YOU_OWN_YOUR_OWN', { expiresIn: '24h' });

before('Admin signin', (done) => {
  const user = {
    email: 'joseph@gmail.com',
    password: '123456',
  };
  chai.request(app)
    .post('/api/v1/auth/signin')
    .send(user)
    .end((err, res) => {
      done();
    });
});
// Test get for getting all the accounts
describe('Get all the accounts', () => {
  it('Get all the accounts', () => {
    chai.request(app)
      .get('/api/v2/accounts')
      .set('Authorization', token)
      .end((err, res) => {
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('status');
        expect(res.body).to.have.property('error');
        expect(res.body.status).to.be.equal(401);
      });
  });
});
