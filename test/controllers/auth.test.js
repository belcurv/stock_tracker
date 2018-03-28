/* global describe it beforeEach */

'use strict';

/* ================================= SETUP ================================= */

process.env.NODE_ENV = 'testing';

const chai     = require('chai');
const chaiHttp = require('chai-http');
const server   = require('../../server');
const db       = require('../../db/index');
const jwt      = require('jsonwebtoken');

const expect   = chai.expect;
const secret   = process.env.JWT_SECRET;

chai.use(chaiHttp);

const register_details = {
  username  : 'dummy',
  password1 : 'testpassword1',
  password2 : 'testpassword1'
};

const login_details = {
  username  : 'dummy',
  password  : 'testpassword1'
};


/* ================================= TESTS ================================= */

describe('Authentication controller', () => {
  
  beforeEach((done) => {
    const collection = db.get().collection('users');
    collection.deleteMany({}, () => {
      done();
    });
  });


  // Test: Register a new account, then verify received JWT
  describe('POST >> /auth/register', () => {

    it('should return valid JWT on registration success', () => {
      return chai.request(server)
        .post('/auth/register')
        .send(register_details)
        .then((res) => {
          jwt.verify(res.body, secret, (err, decoded) => {
            if (err) { throw new Error(err.message); }

            expect(res).to.have.status(200);
            expect(decoded.user).to.have.all.keys(['_id', 'username' ]);
            expect(decoded.user).to.deep.include({ username : 'dummy' });
            
          });
        })
        .catch((err) => {
          throw new Error(err);
        });
    });


    it('should return an error if username already in use', () => {
      return chai.request(server)
        .post('/auth/register')
        .send(register_details)
        .then(() => {

          // register again - should fail
          chai.request(server)
            .post('/auth/register')
            .send(register_details)
            .then((res) => {
              expect(res).to.have.status(500);
              expect(res.body.message).to.eql('Username already taken');
            });
        })
        .catch((err) => {
          throw new Error(err);
        });
    });


    it('should return an error message if username omitted', () => {
      return chai.request(server)
        .post('/auth/register')
        .send({
          password1 : 'testpassword',
          password2 : 'testpassword'
        })
        .then((res) => {
          expect(res).to.have.status(400);
          expect(res.body.message).to.eql('Missing required fields');
        })
        .catch((err) => {
          throw new Error(err);
        });
    });


    it('should return an error message if password omitted', () => {
      return chai.request(server)
        .post('/auth/register')
        .send({
          username  : 'dummy',
          password1 : 'testpassword'
        })
        .then((res) => {
          expect(res).to.have.status(400);
          expect(res.body.message).to.eql('Missing required fields');
        })
        .catch((err) => {
          throw new Error(err);
        });
    });


    it('should return an error message if passwords do not match', () => {
      return chai.request(server)
        .post('/auth/register')
        .send({
          username  : 'dummy',
          password1 : 'testpassword',
          password2 : 'typo'
        })
        .then((res) => {
          expect(res).to.have.status(400);
          expect(res.body.message).to.eql('Passwords must match');
        })
        .catch((err) => {
          throw new Error(err);
        });
    });

  });


  // Test: Register and login to an account, then verify received JWT
  describe('POST >> /auth/login', () => {

    it('should return valid JWT on login success', () => {

      // first register a new user
      return chai.request(server)
        .post('/auth/register')
        .send(register_details)
        .then(() => {

          // then attempt to login that user
          return chai.request(server)
            .post('/auth/login')
            .send(login_details)
            .then((res) => {
              jwt.verify(res.body, secret, (err, decoded) => {
                if (err) { throw new Error(err.message); }

                expect(res).to.have.status(200);
                expect(decoded.user).to.have.all.keys(['_id', 'username' ]);
                expect(decoded.user).to.deep.include({ username : 'dummy' });

              });
            });
        })
        .catch((err) => {
          throw new Error(err);
        });
    });


    it('should return error message if username omitted', () => {

      return chai.request(server)
        .post('/auth/register')
        .send(register_details)
        .then(() => {

          // then attempt to login that user
          return chai.request(server)
            .post('/auth/login')
            .send({ password: 'testpassword'})
            .then((res) => {
              expect(res).to.have.status(500);
              expect(res.body.message).to.eql('Missing required fields');
            });
        })
        .catch((err) => {
          throw new Error(err);
        });
    });


    it('should return error message if password omitted', () => {

      return chai.request(server)
        .post('/auth/register')
        .send(register_details)
        .then(() => {

          // then attempt to login that user
          return chai.request(server)
            .post('/auth/login')
            .send({ username: 'dummy'})
            .then((res) => {
              expect(res).to.have.status(500);
              expect(res.body.message).to.eql('Missing required fields');
            });
        })
        .catch((err) => {
          throw new Error(err);
        });
    });


    it('should return error message if user not found', () => {

      return chai.request(server)
        .post('/auth/register')
        .send(register_details)
        .then(() => {

          // then attempt to login that user
          return chai.request(server)
            .post('/auth/login')
            .send({ username: 'faker', password: 'doesntmatter' })
            .then((res) => {
              expect(res).to.have.status(404);
              expect(res.body.message).to.eql('No user with that username');
            });
        })
        .catch((err) => {
          throw new Error(err);
        });
    });


    it('should return error message on invalid password', () => {

      return chai.request(server)
        .post('/auth/register')
        .send(register_details)
        .then(() => {

          // then attempt to login that user
          return chai.request(server)
            .post('/auth/login')
            .send({ username: 'dummy', password: 'wrong'})
            .then((res) => {
              expect(res).to.have.status(500);
              expect(res.body.message).to.eql('Invalid login credentials');
            });
        })
        .catch((err) => {
          throw new Error(err);
        });
    });

  });

});