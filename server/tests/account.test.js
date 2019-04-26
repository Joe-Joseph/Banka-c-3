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
});

//   it('Update account', (done) => {
//     chai.request(app)
//       .get('/api/v2/accounts')
//       .set('Authorization', token)
//       .end((err, res) => {
//         // console.log(res.body);
//         chai.request(app)
//           .post(`/api/v2/accounts/${res.body.data.accountNumber}`)
//           .set('Authorization', token)
//           .send({
//             status: '',
//           })
//           .end((err, res) => {
//             console.log(res.body);
//             expect(res.body).to.be.an('object');
//             expect(res.body).to.have.property('status');
//             expect(res.body).to.have.property('data');
//             expect(res.body.status).to.be.equal(400);
//             done();
//           });
//       });
//   });
// });

// })
