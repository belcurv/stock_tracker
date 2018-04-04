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


  describe('.exists()', () => {

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
      assert.isFunction(Users.exists);
    });

    it('should return true if a user exists in DB', async () => {
      const result = await Users.exists(testEmail);
      assert.isTrue(result);
    });

    it('should return false if user email not found in DB', async () => {
      const result = await Users.exists('not-found@example.com');
      assert.isFalse(result);
    });

    it('should throw exception when user email omitted', async () => {
      try{
        const result = await Users.exists();
        if (result) { throw new Error('this block should not execute'); }
      } catch (err) {
        assert.equal(err.message, 'Missing required "email" parameter');
      }
    });

  });


  describe('.create()', () => {

    it('should be a function', () => {
      assert.isFunction(Users.create);
    });

    it('should save a user to the DB', async () => {
      const result = await Users.create({
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
        const result = await Users.create(badUser);
        if (result) { throw new Error('this block should not execute'); }
      } catch (err) {
        assert.equal(err.message, 'Missing required "email" parameter');
      }
    });

    it('should throw exception from invalid "email" param', async () => {
      const badUser = { email : 'no', pwHash : testPw };
      try {
        const result = await Users.create(badUser);
        if (result) { throw new Error('this block should not execute'); }
      } catch (err) {
        assert.equal(err.message, 'Validation Error: Invalid "email": no');
      }
    });

    it('should throw exception if "pwHash" omitted', async () => {
      const badUser = { email : testEmail };
      try {
        const result = await Users.create(badUser);
        if (result) { throw new Error('this block should not execute'); }
      } catch (err) {
        assert.equal(err.message, 'Missing required "pwHash" parameter');
      }
    });

    it('should throw exception from invalid "pwHash" param', async () => {
      const badUser = { email : 'nobody@example.com', pwHash : 'fail' };
      try {
        const result = await Users.create(badUser);
        if (result) { throw new Error('this block should not execute'); }
      } catch (err) {
        assert.equal(err.message, 'Validation Error: Invalid "pwHash": fail');
      }
    });

  });


  describe('.findByEmail()', () => {

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
      assert.isFunction(Users.findByEmail);
    });

    it('should return a user from the DB', async () => {
      const result = await Users.findByEmail(testEmail);
      assert.equal(result.email, testEmail);
    });

    it('should return null if user email not found in DB', async () => {
      const result = await Users.findByEmail('not.found@example.com');
      assert.isNull(result);
    });

    it('should throw exception when user email arg omitted', async () => {
      try{
        const result = await Users.findByEmail();
        if (result) { throw new Error('this block should not execute'); }
      } catch (err) {
        assert.equal(err.message, 'Missing required "email" parameter');
      }
    });

  });


  describe('.findById()', () => {

    beforeEach((done) => {
      const collection = db.get().collection('users');
      const doc = {
        _id       : '101010101010101010101010',
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
      assert.isFunction(Users.findById);
    });

    it('should return a user from the DB', async () => {
      const testId = '101010101010101010101010';
      const result = await Users.findById(testId);
      assert.equal(result._id, testId);
    });

    it('should not include password in result', async () => {
      const testId = '101010101010101010101010';
      const result = await Users.findById(testId);
      assert.isUndefined(result.password);
    });

    it('should return null if user _id not found in DB', async () => {
      const testId = '001100110011001100110011';
      const result = await Users.findById(testId);
      assert.isNull(result);
    });

    it('should throw error if "_id" param is omitted', async () => {
      try {
        const result = await Users.findById();
        if (result) { throw new Error('this block should not execute'); }
      } catch (err) {
        assert.equal(err.message, 'Missing required "_id" parameter');
      }
    });

  });


  describe('.deleteOne', () => {

    beforeEach((done) => {
      const collection = db.get().collection('users');
      const doc = {
        _id       : '101010101010101010101010',
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
      assert.isFunction(Users.deleteOne);
    });

    it('should delete a user from the DB', async () => {
      const testId = '101010101010101010101010';
      const { deletedCount } = await Users.deleteOne(testId);
      assert.equal(deletedCount, 1);
    });

    it('should not delete anything if user not found in DB', async () => {
      const testId = '001100110011001100110011';
      const { deletedCount } = await Users.deleteOne(testId);
      assert.equal(deletedCount, 0);
    });

    it('should throw error if "_id" param is omitted', async () => {
      try {
        const result = await Users.deleteOne();
        if (result) { throw new Error('this block should not execute'); }
      } catch (err) {
        assert.equal(err.message, 'Missing required "_id" parameter');
      }
    });

  });

});
