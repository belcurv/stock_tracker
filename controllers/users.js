'use strict';

/* ================================= SETUP ================================= */

const router = require('express').Router();
// const db     = require('../db');

/* ========================== ROUTE CONTROLLERS ============================ */

/**
 * Delete a user a account and all associated portfolios.
 * Example: DELETE >> /api/users/:id
 * Secured: Yes
 * Expects: username and _id from valid JWT
 * Returns: JSON success message
*/
router.delete('/users/:id', (req, res) => {
  res.status(200).json({ message : 'Hello from the api/users route'});
});


/* ================================ EXPORTS ================================ */

module.exports = router;
