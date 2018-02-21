/* globals describe before after it */

'use strict';

/* ================================= SETUP ================================= */

const db         = require('../../db/index');
const { assert } = require('chai');
const Users      = require('../../models/users');

// dummy user
const testUsername  = 'Ql8n4yyshA%E7';
const testPassword1 = 'testdummypass1';
const testPassword2 = 'testdummypass2';


/* ================================= TESTS ================================= */

describe('users model', function() {

  before(done => {
    db.connect('mongodb://localhost:27017/stocktracker', () => {
      const collection = db.get().collection('users');
      const doc = {
        username  : testUsername,
        password  : testPassword1,
        createdAt : Date.now(),
        updatedAt : Date.now()
      };
      collection.insertOne(doc, () => {
        done();
      });
    });
  });

  after(done => {
    const collection = db.get().collection('users');
    // console.log('after collection', collection);
    collection.deleteMany({ username: testUsername }, () => {
      done();
    });
  });


  describe('.usernameExists()', () => {

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

  // describe('.createUser()', function() {



  // });

});



// NEED TO TEST : createUser({ username, password })
/**
 * Register a new user
 * @param    {String}   username    Username
 * @param    {String}   password    Hashed and salted password
 * @returns  {Object}               New user object
*/



// NEED TO TEST : getUser(username)
/**
 * Login
 * @param    {String}   username   Username
 * @returns  {Object}              User object
 */
