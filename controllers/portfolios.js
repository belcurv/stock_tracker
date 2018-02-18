'use strict';

/* ================================= SETUP ================================= */

const router     = require('express').Router();
const jwt        = require('jsonwebtoken');
const Portfolios = require('../models/portfolios');

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
 * Example: GET >> /api/portfolios
 * Secured: yes
 * Expects: user's _id from valid JWT
 * Returns: JSON array of portfolio objects
*/
router.get('/portfolios', (req, res, next) => {
  Portfolios.getAll(req.user._id)
    .then(portfolios => res.status(200).json(portfolios))
    .catch(err => next(err));
  
});


/**
 * Get a specific portfolio belonging to a user
 * Example: GET >> /api/portfolios/65a4sd654asd645asd
 * Secured: yes
 * Expects: portfolio _id from req params, user _id from JWT
 * Returns: JSON portfolio objects
*/
router.get('/portfolios/:id', (req, res, next) => {
  Portfolios.getOne(req.user._id, req.params.id)
    .then(portfolio => res.status(200).json(portfolio))
    .catch(err => next(err));
});


/**
 * Create a new portfolio
 * Example: POST >> /api/portfolios
 * Secured: yes
 * Expects: portfolio name from req body, user _id from JWT
 * Returns: JSON portfolio object
*/
router.post('/portfolios', (req, res, next) => {
  const newPortfolio = {
    owner : req.user._id,
    name  : req.body.name,
    notes : req.body.notes
  };
  
  Portfolios.create(newPortfolio)
    .then(result => res.status(200).json(result))
    .catch(err => next(err));
  
});


/**
 * Update a user's portfolio
 * Example: PUT >> /api/portfolios/564asd654asd56a4sd
 * Secured: yes
 * Expects: portfolio _id from req params, updates from req body, user _id from JWT
 * Returns: JSON portfolio object
*/
router.put('/portfolios/:id', (req, res, next) => {
  const filter = {
    owner : req.user._id,
    _id   : req.params.id
  };
  const updates = {
    name  : req.body.name,
    notes : req.body.notes
  };

  Portfolios.update(filter, updates)
    .then(result => res.status(200).json(result))
    .catch(err   => next(err));

});


/**
 * Delete a user's portfolio
 * Example: DELETE >> /api/portfolios/564asd654asd56a4sd
 * Secured: yes
 * Expects: portfolio _id from req params, user _id from valid JWT
 * Returns: JSON success message
*/
router.delete('/portfolios/:id', (req, res, next) => {

  Portfolios.deletePortfolio(req.user._id, req.params._id)
    .then(result => res.status(200).json(result))
    .catch(err => next(err));

});


/**
 * Add holding to portfolio
 * Example: POST >> /api/portfolios/564asd654asd56a4sd/holdings
 * Secured: yes
 * Expects: portfolio _id from req params, ticker and qty from req body, username and _id from valid JWT
 * Returns: JSON portfolio object
*/
router.post('/portfolios/:id/holdings', (req, res, next) => {

  const filter = {
    owner  : req.user._id,
    _id    : req.params.id
  };
  
  const updates = {
    ticker : req.body.ticker,
    qty    : req.body.qty
  };

  Portfolios.addHolding(filter, updates)
    .then(result => res.status(200).json(result))
    .catch(err   => next(err));

});


/**
 * Update a holding in a user's portfolio
 * Example: PUT >> /api/portfolios/564asd654asd56a4sd/holdings/65asd65a4sd564asd564
 * Secured: yes
 * Expects: portfolio _id & holding _id from req params, qty from req body, username and _id from valid JWT
 * Returns: JSON portfolio object
*/
router.put('/portfolios/:id/holdings/:id', (req, res) => {
  res.status(200).json({ message: 'router is working OK!' });
});


/**
 * Delete a holding from a user's portfolio
 * Example: DELETE >> /api/portfolios/564asd654asd56a4sd/holdings/65asd65a4sd564asd564
 * Secured: yes
 * Expects: portfolio _id & holding _id from req params, username and _id from valid JWT
 * Returns: JSON success message
*/
router.delete('/portfolios/:id/holdings/:id', (req, res) => {
  res.status(200).json({ message: 'router is working OK!' });
});


/* ================================ EXPORTS ================================ */

module.exports = router;
