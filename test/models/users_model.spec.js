/* globals describe before beforeEach after it */

'use strict';

/* ================================= SETUP ================================= */

process.env.NODE_ENV = 'testing';

const db         = require('../../db/index');
const { assert } = require('chai');
const Users      = require('../../models/users');

// dummy user
const testUsername  = 'Ql8n4yyshA%E7';
const testPassword1 = 'testdummypass1';


/* ================================= TESTS ================================= */

describe('users model', function() {

  before(done => {
    db.connect((err) => {
      if (err) {
        console.log('Unable to connect to MongoDB', err);
        process.exit(1);
      } else {
        done();
      }
    });
  });


  after(done => {
    const collection = db.get().collection('users');
    collection.deleteMany({ username: testUsername }, () => {
      db.close(function() {
        done();
      });
    });
  });


  describe('.usernameExists()', () => {

    beforeEach(done => {
      const collection = db.get().collection('users');
      const doc = {
        username: testUsername,
        password: testPassword1,
        createdAt: Date.now(),
        updatedAt: Date.now()
      };
      collection.insertOne(doc, () => {
        done();
      });
    });

    it('should be a function', () => {
      assert.isFunction(Users.usernameExists);
    });

    it('should return true if a username exists in DB', async () => {
      const result = await Users.usernameExists(testUsername);
      assert.isTrue(result);
    });

    it('should return false if username not found in DB', async () => {
      const result = await Users.usernameExists('A%E7Ql8n4yysh');
      assert.isFalse(result);
    });

    it('should return false if arg "username" omitted', async () => {
      const result = await Users.usernameExists();
      assert.isFalse(result);
    });

  });


  describe('.createUser()', () => {

    it('should be a function', () => {
      assert.isFunction(Users.createUser);
    });

    it('should save a user to the DB', async () => {
      const result = await Users.createUser({
        username: testUsername,
        password: testPassword1
      });
      assert.hasAllKeys(result, [
        '_id', 'username', 'password', 'createdAt', 'updatedAt'
      ]);
      assert.propertyVal(result, 'username', testUsername);
      assert.propertyVal(result, 'password', testPassword1);
    });

  });


  describe('.getUser()', () => {

    beforeEach(done => {
      const collection = db.get().collection('users');
      const doc = {
        username: testUsername,
        password: testPassword1,
        createdAt: Date.now(),
        updatedAt: Date.now()
      };
      collection.insertOne(doc, () => {
        done();
      });
    });

    it('should be a function', () => {
      assert.isFunction(Users.getUser);
    });

    it('should return a user from the DB', async () => {
      const result = await Users.getUser(testUsername);
      assert.equal(result.username, testUsername);
    });

    it('should return "null" if user not found in DB', async () => {
      const result = await Users.getUser('ziggy');
      assert.isNull(result);
    });

  });

});
