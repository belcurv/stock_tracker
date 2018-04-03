'use strict';

/* ================================= SETUP ================================= */

const sanitize  = require('../utils/sanitizeMongoQuery');
const db        = require('../db');

const Validator = require('../utils/validateModelParams');
const validate  = new Validator();


/* ============================ PUBLIC METHODS ============================= */

/** Check for username already exists
 *  @param    {String}   email   Candidate email address
 *  @returns  {Boolean}          True if username already exists
*/
const userExists = (email) => {

  try {
    validate.check({ email });
  } catch (err) {
    return Promise.reject(err);
  }

  const collection = db.get().collection('users');

  const target = { email };

  return collection
    .find(target)
    .count()
    .then(count => count > 0 ? true : false);

};


/** Create a new user
 *  @param    {String}   email       User email address
 *  @param    {String}   password    Hashed and salted password
 *  @returns  {Object}               New user object
*/
const createUser = async ({ email, pwHash }) => {

  try {
    validate.check({ email, pwHash });
  } catch (err) {
    return Promise.reject(err);
  }

  const collection = db.get().collection('users');
  const now = Date.now();

  const newUser = {
    email     : sanitize(email),
    password  : sanitize(pwHash),
    createdAt : now,
    updatedAt : now
  };

  return collection.insertOne(newUser)
    .then(result => result.ops[0]);

};


/** Get a user
 *  @param    {String}   email   User email address
 *  @returns  {Object}           User object
*/
const getUser = async (email) => {

  try {
    validate.check({ email });
  } catch (err) {
    return Promise.reject(err);
  }

  const collection = db.get().collection('users');

  const target = { email : sanitize(email) };

  return collection.findOne(target);

};


/* ================================ EXPORTS ================================ */

module.exports = { userExists, createUser, getUser };
