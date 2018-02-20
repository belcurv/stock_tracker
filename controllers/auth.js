'use strict';

/* ================================= SETUP ================================= */

const bcrypt = require('bcryptjs');
const jwt    = require('jsonwebtoken');
const router = require('express').Router();
const Users  = require('../models/users');


/* ================================= UTILS ================================= */

/**
 * Generate a signed JWT token
 * @param    {Object}   user._id        User's _id
 * @param    {Object}   user.username   User's username
 * @returns  {String}                   Signed JWT token
*/
const generateJwt = async ({ _id, username }) => {
  return await jwt.sign(
    { user: { _id, username } },        // payload
    process.env.JWT_SECRET,             // secret
    { expiresIn: '7d' }                 // options
  );
};


/* ========================== ROUTE CONTROLLERS ============================ */

/**
 * New user registration.
 * Example: POST >> /auth/register
 * Secured: No
 * Expects: username & passwords from http POST request body
 * Returns: JWT (String)
*/
router.post('/register', async (req, res, next) => {

  if (!req.body.username || !req.body.password1 || !req.body.password2) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  // fail if passwords do not match
  if (req.body.password1 !== req.body.password2) {
    return res.status(400).json({ message: 'Passwords must match' });
  }

  // trim inputs
  const newUser = {
    username: req.body.username.trim()
  };

  const password = req.body.password1.trim();

  // check for existing user with same username
  const user = await Users.usernameExists(newUser.username);
  if (user) {
    return res.status(500).json({ message: 'username already taken' });
  }

  // generate salt
  const salt = await bcrypt.genSalt(10);
  // set newUser password to salted hash
  newUser.password = await bcrypt.hash(password, salt);

  Users.createUser(newUser)
    .then(result => generateJwt({
      username : result.ops[0].username,
      _id      : result.ops[0]._id
    }))
    .then(token => res.status(200).json(token))
    .catch(err  => next(err));
  
});


/**
 * User login.
 * Example: POST >> /auth/login
 * Secured: No
 * Expects: username and password from http POST request body
 * Returns: JWT (String)
*/
router.post('/login', async (req, res, next) => {

  if (!req.body.username || !req.body.password) {
    return res.status(500).json({ message: 'Missing required fields' });
  }

  // trim inputs
  const username = req.body.username.trim();
  const password = req.body.password.trim();

  // check for a user
  const user = await Users.getUser(username);
  if (!user) {
    return res.status(404).json({ message: 'No user with that username' });
  }

  // validate password
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    return res.status(500).json({ message: 'Invalid login credentials.' });
  }

  // generate and return a JWT
  generateJwt(user)
    .then(token => res.status(200).json(token))
    .catch(err  => next(err));

});


/* ================================ EXPORTS ================================ */

module.exports = router;
