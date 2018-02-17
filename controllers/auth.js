'use strict';

/* ================================= SETUP ================================= */

const router = require('express').Router();
// const db     = require('../db');

/* ================================ ROUTES ================================= */

/**
 * New user registration.
 * Example: POST >> /auth/register
 * Secured: No
 * Expects: username and password in http POST request body
 * Returns: JSON success message & JWT
*/
router.post('/register', (req, res) => {
  res.status(200).json({ message: 'Hello from the register route!' });
});


/**
 * User login.
 * Example: POST >> /auth/login
 * Secured: No
 * Expects: username and password in http POST request body
 * Returns: JSON success message & JWT
*/
router.post('/login', (req, res) => {
  res.status(200).json({ message: 'Hello from the login route!' });
});




/* ================================ EXPORTS ================================ */

module.exports = router;
