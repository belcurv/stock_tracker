/* globals describe before beforeEach after it */

'use strict';

/* ================================= SETUP ================================= */

process.env.NODE_ENV = 'testing';

const { assert } = require('chai');
const db         = require('../../db/index');
const Users      = require('../../models/users');

// dummy user
const testEmail = 'dummy@example.com';
const testPw = '$2a$10$SBMnu60hsNZAzJ7Mw6gxiXJcMZRvYF1g8xM7Xvb1mB3BlAGikDEsu';


/* ================================= TESTS ================================= */

describe('Users model', function() {

  before((done) => {
    db.connect((err) => {
      if (err) {
        console.log('Unable to connect to MongoDB\n', err);
        process.exit(1);
      } else {
        done();
      }
    });
  });


  after((done) => {
    const collection = db.get().collection('users');
    collection.deleteMany(() => {
      db.close(() => {
        done();
      });
    });
  });


  describe('.userExists()', () => {

    beforeEach((done) => {
      const collection = db.get().collection('users');
      const doc = {
        email     : testEmail,
        password  : testPw,
        createdAt : Date.now(),
        updatedAt : Date.now()
      };
      collection.insertOne(doc, () => {
        done();
      });
    });

    it('should be a function', () => {
      assert.isFunction(Users.userExists);
    });

    it('should return true if a user exists in DB', async () => {
      const result = await Users.userExists(testEmail);
      assert.isTrue(result);
    });

    it('should return false if user email not found in DB', async () => {
      const result = await Users.userExists('not-found@example.com');
      assert.isFalse(result);
    });

    it('should throw exception when user email omitted', async () => {
      try{
        const result = await Users.userExists();
        if (result) { throw new Error('this block should not execute'); }
      } catch (err) {
        assert.equal(err.message, 'Missing required "email" parameter');
      }
    });

  });


  describe('.createUser()', () => {

    it('should be a function', () => {
      assert.isFunction(Users.createUser);
    });

    it('should save a user to the DB', async () => {
      const result = await Users.createUser({
        email  : testEmail,
        pwHash : testPw
      });
      assert.hasAllKeys(result, [
        '_id', 'email', 'password', 'createdAt', 'updatedAt'
      ]);
      assert.propertyVal(result, 'email', testEmail);
      assert.propertyVal(result, 'password', testPw);
    });

    it('should throw exception if "email" omitted', async () => {
      const badUser = { pwHash : testPw };
      try {
        const result = await Users.createUser(badUser);
        if (result) { throw new Error('this block should not execute'); }
      } catch (err) {
        assert.equal(err.message, 'Missing required "email" parameter');
      }
    });

    it('should throw exception from invalid "email" param', async () => {
      const badUser = { email : 'no', pwHash : testPw };
      try {
        const result = await Users.createUser(badUser);
        if (result) { throw new Error('this block should not execute'); }
      } catch (err) {
        assert.equal(err.message, 'Validation Error: Invalid "email": no');
      }
    });

    it('should throw exception if "pwHash" omitted', async () => {
      const badUser = { email : testEmail };
      try {
        const result = await Users.createUser(badUser);
        if (result) { throw new Error('this block should not execute'); }
      } catch (err) {
        assert.equal(err.message, 'Missing required "pwHash" parameter');
      }
    });

    it('should throw exception from invalid "pwHash" param', async () => {
      const badUser = { email : 'nobody@example.com', pwHash : 'fail' };
      try {
        const result = await Users.createUser(badUser);
        if (result) { throw new Error('this block should not execute'); }
      } catch (err) {
        assert.equal(err.message, 'Validation Error: Invalid "pwHash": fail');
      }
    });

  });


  describe('.getUser()', () => {

    beforeEach((done) => {
      const collection = db.get().collection('users');
      const doc = {
        email     : testEmail,
        password  : testPw,
        createdAt : Date.now(),
        updatedAt : Date.now()
      };
      collection.insertOne(doc, () => {
        done();
      });
    });

    it('should be a function', () => {
      assert.isFunction(Users.getUser);
    });

    it('should return a user from the DB', async () => {
      const result = await Users.getUser(testEmail);
      assert.equal(result.email, testEmail);
    });

    it('should return null if user email not found in DB', async () => {
      const result = await Users.getUser('not.found@example.com');
      assert.isNull(result);
    });

    it('should throw exception when user email arg omitted', async () => {
      try{
        const result = await Users.getUser();
        if (result) { throw new Error('this block should not execute'); }
      } catch (err) {
        assert.equal(err.message, 'Missing required "email" parameter');
      }
    });

  });

});
