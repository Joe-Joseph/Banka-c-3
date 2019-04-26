import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';

chai.use(chaiHttp);

describe('Welcome', () => {
  it('Signup user', (done) => {
    chai
      .request(app)
      .get('/')
      .end((err, res) => {
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('message');
        done();
      });
  });
});

describe('signup', () => {
  it('Signup user', (done) => {
    chai
      .request(app)
      .post('/api/v2/auth/signup')
      .send({
        firstName: 'Joseph',
        lastName: 'Joe',
        password: '123456',
        email: 'joe@test.com',
      })
      .end((err, res) => {
        console.log(res.body);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('status');
        expect(res.body.status).to.equal(201);
        done();
      });
  });

  it('Provide valid values', (done) => {
    chai
      .request(app)
      .post('/api/v2/auth/signup')
      .send({
        firstname: '',
        lastname: 'Joseph',
        password: '123456',
        email: 'joe@test.com',
      })
      .end((err, res) => {
        expect(res.body).to.be.an('object');
        expect(res.body.status).to.equal(400);
        expect(res.body.error).to.be.a('string');
        expect(res.body).to.have.property('status');
        expect(res.body).to.have.property('error');
        done();
      });
  });

  it('Email already registered', (done) => {
    chai
      .request(app)
      .post('/api/v2/auth/signup')
      .send({
        firstname: 'Joseph',
        lastname: 'Joe',
        password: '123456',
        email: 'joe@test.com',
      })
      .end((err, res) => {
        expect(res.body).to.be.an('object');
        expect(res.body.status).to.deep.equal(400);
        expect(res.body.error).to.be.a('string');
        expect(res.body).to.have.property('status');
        expect(res.body).to.have.property('error');
        done();
      });
  });
});

describe('sigin', () => {
  it('Signin', (done) => {
    chai
      .request(app)
      .post('/api/v2/auth/signin')
      .send({
        email: 'joe@test.com',
        password: '123456',
      })
      .end((err, res) => {
        console.log(res.body);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('status');
        expect(res.body.status).to.equal(200);
        done();
      });
  });
});
