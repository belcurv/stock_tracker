'use strict';

/* ================================= SETUP ================================= */

const router = require('express').Router();
const authCtrl = require('../controllers/auth');


/* ========================== ROUTE CONTROLLERS ============================ */

/**
 * New user registration.
 * Example: POST >> /auth/register
 * Secured: No
 * Expects: username & passwords from http POST request body
 * Returns: JWT (String)
*/
router.post('/register', authCtrl.register);


/**
 * User login.
 * Example: POST >> /auth/login
 * Secured: No
 * Expects: username and password from http POST request body
 * Returns: JWT (String)
*/
router.post('/login', authCtrl.login);


/* ================================ EXPORTS ================================ */

module.exports = router;
