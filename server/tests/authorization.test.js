import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';

const { expect } = chai;
chai.use(chaiHttp);

describe('Signup', () => {
  it('Allow user to signup', () => {
    chai.request(app)
      .post('/api/v2/auth/signup')
      .send({
        firstname: 'Joseph',
        lastname: 'joe',
        email: 'user@gmail.com',
        password: '123456',
        type: 'user',
      })
      .end((err, res) => {
        expect(res.body.status).to.equal(201);
        expect(res.body).to.have.property('status');
        expect(res.body).to.have.property('message');
        expect(res.body).to.have.property('data');
        expect(res.body).to.be.an('object');
      });
  });

  it('isAdmin should be true or false', () => {
    chai.request(app)
      .post('/api/v2/auth/signup')
      .send({
        firstname: 'Joseph',
        lastname: 'joe',
        email: 'joe@gmail.com',
        password: '123456',
        isAdmin: 'ok',
      })
      .end((err, res) => {
        expect(res.body.status).to.equal(400);
        expect(res.body).to.have.property('status');
        expect(res.body).to.have.property('error');
        expect(res.body).to.be.an('object');
      });
  });

  it('All fields are required', () => {
    chai.request(app)
      .post('/api/v2/auth/signup')
      .send({
        firstname: '',
        lastname: '',
        email: '',
        password: '',
      })
      .end((err, res) => {
        expect(res.body.status).to.equal(400);
        expect(res.body).to.have.property('status');
        expect(res.body).to.have.property('error');
        expect(res.body).to.be.an('object');
      });
  });

  it('Email already exists', () => {
    chai.request(app)
      .post('/api/v2/auth/signup')
      .send({
        firstname: 'Joseph',
        lastname: 'joe',
        email: 'user@gmail.com',
        password: '123456',
        type: 'user',
      })
      .end((err, res) => {
        expect(res.body.status).to.equal(400);
        expect(res.body).to.have.property('status');
        expect(res.body).to.have.property('error');
        expect(res.body).to.be.an('object');
      });
  });
});
