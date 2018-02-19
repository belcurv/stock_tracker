'use strict';

/* ================================= SETUP ================================= */

const sanitize = require('../utils/sanitizeMongoQuery');
const db       = require('../db');


/* ============================ PUBLIC METHODS ============================= */

/**
 * Check for username already in use
 * @param    {String}   username   Candidate username
 * @returns  {Boolean}             True if username already exists
*/
const usernameExists = (username) => {
  const collection = db.get().collection('users');

  const target = { username };
  
  return collection
    .find(target)
    .count()
    .then(count => count > 0 ? true : false);

};


/**
 * Register a new user
 * @param    {String}   username    Username
 * @param    {String}   password    Hashed and salted password
 * @returns  {Object}               New user object
*/
const createUser = async ({ username, password }) => {
  const collection = db.get().collection('users');
  const now = Date.now();

  const newUser = {
    username: sanitize(username),
    password: sanitize(password),
    createdAt: now,
    updatedAt: now
  };

  return collection.insertOne(newUser);

};


/**
 * Login
 * @param    {String}   username   Username
 * @returns  {Object}              User object
 */
const getUser = async (username) => {
  const collection = db.get().collection('users');

  const target = { username: sanitize(username) };

  return collection.findOne(target);
 
};




/* ================================ EXPORTS ================================ */

module.exports = { usernameExists, createUser, getUser };
