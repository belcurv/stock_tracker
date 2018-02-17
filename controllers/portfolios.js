'use strict';

/* ================================= SETUP ================================= */

const router = require('express').Router();
const jwt    = require('jsonwebtoken');
const db     = require('../db');


/* ============================== MIDDLEWARE =============================== */

/**
 * Verify JWT token
*/
const verifyJWT = (req, res, next) => {
  const token  = req.headers.authorization;
  const secret = process.env.JWT_SECRET;

  // fail if missing required pieces
  if (!token || !secret) {
    return next(new Error('Missing components for JWT verification'));
  }

  jwt.verify(token, secret, (err, decoded) => {
    if (err) {
      return next(new Error(err.message));
    }

    if (decoded.user._id && decoded.user.username) {
      // OK. Set req.user
      req.user = decoded.user;
      next();
    } else {
      return next(new Error('Missing required user attributes'));
    }

  });
  
};

router.use(verifyJWT);

/* ========================== ROUTE CONTROLLERS ============================ */

/**
 * Get all user's portfolios
 * Example: GET >> /
 * Secured: yes
 * Expects: user's _id from valid JWT
 * Returns: JSON array of portfolio objects
*/
router.get('/portfolios', (req, res, next) => {
  const portfolios = db.get().collection('portfolios');
  const target = { owner: req.user._id };

  portfolios.find(target)
    .toArray()
    .then(docs => res.status(200).json(docs))
    .catch(err => next(err));
  
});


/**
 * Get a user's specific portfolio
 * Example: GET >> //65a4sd654asd645asd
 * Secured: yes
 * Expects: portfolio _id from req params, username and _id from valid JWT
 * Returns: JSON portfolio objects
*/
router.get('/portfolios/:id', (req, res) => {
  res.status(200).json({ message: 'router is working OK!' });
});


/**
 * Create a new portfolio
 * Example: POST >> //
 * Secured: yes
 * Expects: portfolio name from req body, username and _id from valid JWT
 * Returns: JSON portfolio object
*/
router.post('/portfolios', (req, res) => {
  res.status(200).json({ message: 'router is working OK!' });
});


/**
 * Update a user's portfolio
 * Example: PUT >> //564asd654asd56a4sd
 * Secured: yes
 * Expects: portfolio _id from req params, updates from req body, username and _id from valid JWT
 * Returns: JSON portfolio object
*/
router.put('/portfolios/:id', (req, res) => {
  res.status(200).json({ message: 'router is working OK!' });
});


/**
 * Delete a user's portfolio
 * Example: DELETE >> /api/portfolio/564asd654asd56a4sd
 * Secured: yes
 * Expects: portfolio _id from req params, username and _id from valid JWT
 * Returns: JSON success message
*/
router.delete('/portfolios/:id', (req, res) => {
  res.status(200).json({ message: 'router is working OK!' });
});


/**
 * Add holding to portfolio
 * Example: POST >> /api/portfolio/564asd654asd56a4sd/holdings
 * Secured: yes
 * Expects: portfolio _id from req params, ticker and qty from req body, username and _id from valid JWT
 * Returns: JSON portfolio object
*/
router.post('/portfolios/:id/holdings', (req, res) => {
  res.status(200).json({ message: 'router is working OK!' });
});


/**
 * Update a holding in a user's portfolio
 * Example: PUT >> /api/portfolio/564asd654asd56a4sd/holdings/65asd65a4sd564asd564
 * Secured: yes
 * Expects: portfolio _id & holding _id from req params, qty from req body, username and _id from valid JWT
 * Returns: JSON portfolio object
*/
router.put('/portfolios/:id/holdings/:id', (req, res) => {
  res.status(200).json({ message: 'router is working OK!' });
});


/**
 * Delete a holding from a user's portfolio
 * Example: DELETE >> /api/portfolio/564asd654asd56a4sd/holdings/65asd65a4sd564asd564
 * Secured: yes
 * Expects: portfolio _id & holding _id from req params, username and _id from valid JWT
 * Returns: JSON success message
*/
router.delete('/portfolios/:id/holdings/:id', (req, res) => {
  res.status(200).json({ message: 'router is working OK!' });
});


/* ================================ EXPORTS ================================ */

module.exports = router;
