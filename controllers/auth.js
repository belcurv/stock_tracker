'use strict';

/* ================================= SETUP ================================= */

const bcrypt      = require('bcryptjs');
const generateJwt = require('../utils/generate-jwt');

const router = require('express').Router();
const Users  = require('../models/users');


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

  if (req.body.password1 !== req.body.password2) {
    return res.status(400).json({ message: 'Passwords must match' });
  }

  const newUser = {
    username: req.body.username
  };

  const password = req.body.password1;

  // check for existing user with same username
  const user = await Users.usernameExists(newUser.username);
  if (user) {
    return res.status(500).json({ message: 'Username already taken' });
  }

  const salt = await bcrypt.genSalt(10);
  newUser.pwHash = await bcrypt.hash(password, salt);

  Users.createUser(newUser)
    .then(result => generateJwt({
      username : result.username,
      _id      : result._id
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

  const username = req.body.username;
  const password = req.body.password;

  const user = await Users.getUser(username);
  if (!user) {
    return res.status(404).json({ message: 'No user with that username' });
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    return res.status(500).json({ message: 'Invalid login credentials' });
  }

  generateJwt({_id: user._id, username: user.username})
    .then(token => res.status(200).json(token))
    .catch(err  => next(err));

});


/* ================================ EXPORTS ================================ */

module.exports = router;
