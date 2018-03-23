'use strict';

/* ================================= SETUP ================================= */

const sanitize  = require('../utils/sanitizeMongoQuery');
const db        = require('../db');

const Validator = require('../utils/validateModelParams');
const validate  = new Validator();


/* ============================ PUBLIC METHODS ============================= */

/** Check for username already exists
 *  @param    {String}   username   Candidate username
 *  @returns  {Boolean}             True if username already exists
*/
const usernameExists = (username) => {

  try {
    validate.check({ username });
  } catch (err) {
    return Promise.reject(err);
  }

  const collection = db.get().collection('users');

  const target = { username };
  
  return collection
    .find(target)
    .count()
    .then(count => count > 0 ? true : false);

};


/** Create a new user
 *  @param    {String}   username    Username
 *  @param    {String}   password    Hashed and salted password
 *  @returns  {Object}               New user object
*/
const createUser = async ({ username, pwHash }) => {

  try {
    validate.check({ username, pwHash });
  } catch (err) {
    return Promise.reject(err);
  }

  const collection = db.get().collection('users');
  const now = Date.now();

  const newUser = {
    username: sanitize(username),
    password: sanitize(pwHash),
    createdAt: now,
    updatedAt: now
  };

  return collection.insertOne(newUser)
    .then(result => result.ops[0]);

};


/** Get a user
 *  @param    {String}   username   Username
 *  @returns  {Object}              User object
*/
const getUser = async (username) => {

  try {
    validate.check({ username });
  } catch (err) {
    return Promise.reject(err);
  }

  const collection = db.get().collection('users');

  const target = { username: sanitize(username) };

  return collection.findOne(target);
 
};


/* ================================ EXPORTS ================================ */

module.exports = { usernameExists, createUser, getUser };
