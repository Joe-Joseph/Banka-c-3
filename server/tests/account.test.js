import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';

const { expect } = chai;
chai.use(chaiHttp);

let token;

// Test get for getting all the accounts
describe('Accounts', () => {
  before('Admin signin', (done) => {
    const user = {
      email: 'joseph@gmail.com',
      password: '123456',
    };
    chai.request(app)
      .post('/api/v2/auth/signin')
      .send(user)
      .end((err, res) => {
        token = res.body.data;
        done();
      });
  });

  it('Get all accounts', (done) => {
    chai.request(app)
      .get('/api/v2/accounts')
      .set('Authorization', token)
      .end((err, res) => {
        // console.log(res.body);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('status');
        expect(res.body).to.have.property('error');
        expect(res.body.status).to.be.equal(404);
        done();
      });
  });

  it('Anauthorized', (done) => {
    chai.request(app)
      .get('/api/v2/accounts')
      .end((err, res) => {
        // console.log(res.body);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('status');
        expect(res.body).to.have.property('error');
        expect(res.body.status).to.be.equal(400);
        done();
      });
  });

  it('Type should not be empty', (done) => {
    chai.request(app)
      .post('/api/v2/accounts')
      .set('Authorization', token)
      .send({
        type: '',
      })
      .end((err, res) => {
        // console.log(res.body);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('status');
        expect(res.body).to.have.property('error');
        expect(res.body.status).to.be.equal(400);
        done();
      });
  });

  it('Type should be valid value', (done) => {
    chai.request(app)
      .post('/api/v2/accounts')
      .set('Authorization', token)
      .send({
        type: 'good',
      })
      .end((err, res) => {
        // console.log(res.body);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('status');
        expect(res.body).to.have.property('error');
        expect(res.body.status).to.be.equal(400);
        done();
      });
  });

  it('Create account', (done) => {
    chai.request(app)
      .post('/api/v2/accounts')
      .set('Authorization', token)
      .send({
        type: 'current',
      })
      .end((err, res) => {
        // console.log(res.body);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('status');
        expect(res.body).to.have.property('data');
        expect(res.body.status).to.be.equal(201);
        done();
      });
  });

  it('Status should not be empty', (done) => {
    chai.request(app)
      .get('/api/v2/accounts')
      .set('Authorization', token)
      .end((err, res) => {
        // console.log(res.body);
        chai.request(app)
          .patch(`/api/v2/accounts/${res.body.data.accountNumber}/`)
          .set('Authorization', token)
          .send({
            status: '',
          })
          .end((err, res) => {
            // console.log(res.body);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('status');
            expect(res.body).to.have.property('error');
            expect(res.body.status).to.be.equal(400);
            done();
          });
      });
  });

  it('Account is already active', (done) => {
    chai.request(app)
      .get('/api/v2/accounts')
      .set('Authorization', token)
      .end((err, res) => {
        // console.log(res.body);
        chai.request(app)
          .patch(`/api/v2/accounts/${res.body.data[0].accountnumber}/`)
          .set('Authorization', token)
          .send({
            status: 'active',
          })
          .end((err, res) => {
            // console.log(res.body);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('status');
            expect(res.body).to.have.property('error');
            expect(res.body.status).to.be.equal(409);
            done();
          });
      });
  });

  it('Account is already active', (done) => {
    chai.request(app)
      .get('/api/v2/accounts')
      .set('Authorization', token)
      .end((err, res) => {
        // console.log(res.body);
        chai.request(app)
          .patch(`/api/v2/accounts/${res.body.data.accountNumber}/`)
          .set('Authorization', token)
          .send({
            status: 'active',
          })
          .end((err, res) => {
            // console.log(res.body);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('status');
            expect(res.body).to.have.property('error');
            expect(res.body.status).to.be.equal(500);
            done();
          });
      });
  });

  it('Account not found', (done) => {
    chai.request(app)
      .get('/api/v2/accounts')
      .set('Authorization', token)
      .end((err, res) => {
        // console.log(res.body);
        chai.request(app)
          .patch('/api/v2/accounts/123456/')
          .set('Authorization', token)
          .send({
            status: 'dormant',
          })
          .end((err, res) => {
            // console.log(res.body);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('status');
            expect(res.body).to.have.property('error');
            expect(res.body.status).to.be.equal(404);
            done();
          });
      });
  });

  it('Update account status', (done) => {
    chai.request(app)
      .get('/api/v2/accounts')
      .set('Authorization', token)
      .end((err, res) => {
        // console.log(res.body);
        chai.request(app)
          .patch(`/api/v2/accounts/${res.body.data[0].accountnumber}/`)
          .set('Authorization', token)
          .send({
            status: 'dormant',
          })
          .end((err, res) => {
            // console.log(res.body);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('status');
            expect(res.body).to.have.property('data');
            expect(res.body).to.have.property('message');
            expect(res.body.status).to.be.equal(200);
            done();
          });
      });
  });

  it('Get all dormant accounts', (done) => {
    chai.request(app)
      .get('/api/v2/account/?status=dormant')
      .set('Authorization', token)
      .end((err, res) => {
        // console.log(res.body);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('status');
        expect(res.body).to.have.property('data');
        expect(res.body.status).to.be.equal(200);
        done();
      });
  });

  it('Accounts for specific user', (done) => {
    chai.request(app)
      .get('/api/v2/user/joseph@gmail.com/accounts')
      .set('Authorization', token)
      .end((err, res) => {
        // console.log(res.body);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('status');
        expect(res.body).to.have.property('data');
        expect(res.body.status).to.be.equal(200);
        done();
      });
  });

  it('Update account status', (done) => {
    chai.request(app)
      .get('/api/v2/accounts')
      .set('Authorization', token)
      .end((err, res) => {
        // console.log(res.body);
        chai.request(app)
          .delete(`/api/v2/accounts/${res.body.data[0].accountnumber}/`)
          .set('Authorization', token)
          .send({
            status: 'dormant',
          })
          .end((err, res) => {
            // console.log(res.body);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('status');
            expect(res.body).to.have.property('message');
            expect(res.body.status).to.be.equal(200);
            done();
          });
      });
  });

  it('No account found', (done) => {
    chai.request(app)
      .get('/api/v2/account/?status=active')
      .set('Authorization', token)
      .end((err, res) => {
        // console.log(res.body);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('status');
        expect(res.body).to.have.property('error');
        expect(res.body.status).to.be.equal(404);
        done();
      });
  });
});
