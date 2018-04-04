'use strict';

/* ================================= SETUP ================================= */

const bcrypt      = require('bcryptjs');
const generateJwt = require('../utils/generate-jwt');
const Users       = require('../models/users');


/* ========================== ROUTE CONTROLLERS ============================ */

/**
 * New user registration.
 * Example: POST >> /auth/register
 * Secured: No
 * Expects: email & passwords from http POST request body
 * Returns: object w/success {Boolean} and token {String}
*/
const register = async (req, res, next) => {

  if (!req.body.email || !req.body.password1 || !req.body.password2) {
    return res.status(400).json({ message : 'Missing required fields' });
  }

  if (req.body.password1 !== req.body.password2) {
    return res.status(400).json({ message : 'Passwords must match' });
  }

  const newUser = {
    email : req.body.email
  };

  const password = req.body.password1;

  // check for existing user with same email
  const user = await Users.exists(newUser.email);
  if (user) {
    return res.status(500).json({ message : 'email already taken' });
  }

  const salt = await bcrypt.genSalt(10);
  newUser.pwHash = await bcrypt.hash(password, salt);

  return Users.create(newUser)
    .then(result => generateJwt({
      email : result.email,
      _id   : result._id
    }))
    .then(token => res.status(200).json({
      success : true,
      token   : token
    }))
    .catch(err  => next(err));

};


/**
 * User login.
 * Example: POST >> /auth/login
 * Secured: No
 * Expects: email and password from http POST request body
 * Returns: object w/success {Boolean} and token {String}
*/
const login = async (req, res, next) => {

  if (!req.body.email || !req.body.password) {
    return res.status(500).json({ message : 'Missing required fields' });
  }

  const email = req.body.email;
  const password = req.body.password;

  const user = await Users.findByEmail(email);
  if (!user) {
    return res.status(404).json({ message : 'No user with that email' });
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    return res.status(500).json({ message : 'Invalid login credentials' });
  }

  return generateJwt({_id : user._id, email : user.email})
    .then(token => res.status(200).json({
      success : true,
      token   : token
    }))
    .catch(err  => next(err));

};


/* ================================ EXPORTS ================================ */

module.exports = { register, login };
