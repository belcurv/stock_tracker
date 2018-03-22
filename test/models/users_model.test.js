/* globals describe before beforeEach after it */

'use strict';

/* ================================= SETUP ================================= */

process.env.NODE_ENV = 'testing';

const { assert } = require('chai');
const db         = require('../../db/index');
const Users      = require('../../models/users');

// dummy user
const testUn = 'MisterMister';
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


  describe('.usernameExists()', () => {

    beforeEach((done) => {
      const collection = db.get().collection('users');
      const doc = {
        username  : testUn,
        password  : testPw,
        createdAt : Date.now(),
        updatedAt : Date.now()
      };
      collection.insertOne(doc, () => {
        done();
      });
    });

    it('should be a function', () => {
      assert.isFunction(Users.usernameExists);
    });

    it('should return true if a username exists in DB', async () => {
      const result = await Users.usernameExists(testUn);
      assert.isTrue(result);
    });

    it('should return false if username not found in DB', async () => {
      const result = await Users.usernameExists('I do not exist');
      assert.isFalse(result);
    });

    it('should throw exception when "username" omitted', async () => {
      try{
        const result = await Users.usernameExists();
        if (result) { throw new Error('this block should not execute'); }
      } catch (err) {
        assert.equal(err.message, 'Missing required "username" parameter');
      }
    });

  });


  describe('.createUser()', () => {

    it('should be a function', () => {
      assert.isFunction(Users.createUser);
    });

    it('should save a user to the DB', async () => {
      const result = await Users.createUser({
        username : testUn,
        pwHash   : testPw
      });
      assert.hasAllKeys(result, [
        '_id', 'username', 'password', 'createdAt', 'updatedAt'
      ]);
      assert.propertyVal(result, 'username', testUn);
      assert.propertyVal(result, 'password', testPw);
    });

    it('should throw exception if "username" omitted', async () => {
      const badUser = { pwHash : testPw };
      try {
        const result = await Users.createUser(badUser);
        if (result) { throw new Error('this block should not execute'); }
      } catch (err) {
        assert.equal(err.message, 'Missing required "username" parameter');
      }
    });

    it('should throw exception from invalid "username" param', async () => {
      const badUser = { username: 'no', pwHash: testPw };
      try {
        const result = await Users.createUser(badUser);
        if (result) { throw new Error('this block should not execute'); }
      } catch (err) {
        assert.equal(err.message, 'Validation Error: Invalid "username": no');
      }
    });

    it('should throw exception if "pwHash" omitted', async () => {
      const badUser = { username : testUn };
      try {
        const result = await Users.createUser(badUser);
        if (result) { throw new Error('this block should not execute'); }
      } catch (err) {
        assert.equal(err.message, 'Missing required "pwHash" parameter');
      }
    });

    it('should throw exception from invalid "pwHash" param', async () => {
      const badUser = { username: 'Jimmy', pwHash: 'fail' };
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
        username  : testUn,
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
      const result = await Users.getUser(testUn);
      assert.equal(result.username, testUn);
    });

    it('should return null if username not found in DB', async () => {
      const result = await Users.getUser('ziggy');
      assert.isNull(result);
    });

    it('should throw exception when "username" arg omitted', async () => {
      try{
        const result = await Users.getUser();
        if (result) { throw new Error('this block should not execute'); }
      } catch (err) {
        assert.equal(err.message, 'Missing required "username" parameter');
      }
    });

  });

});
