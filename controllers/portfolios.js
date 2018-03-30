'use strict';

/* ================================= SETUP ================================= */

const Portfolios  = require('../models/portfolios');

const isOid       = require('../utils/validateObjectIds');
const isTicker    = require('../utils/validateTickers');

const badParamMsg = 'Malformed URL paramter';
const badBodyMsg  = 'Malformed request body parameter';


/* ========================== ROUTE CONTROLLERS ============================ */

/**
 * Get all user's portfolios
 * Example: GET >> /api/portfolios
 * Secured: yes -- valid JWT required
 * Expects: 
 *    1) user _id from valid JWT
 * Returns: JSON array of portfolio objects
*/
const getAll = (req, res, next) => {
  return Portfolios.getAll(req.user._id)
    .then(portfolios => res.status(200).json(portfolios))
    .catch(err => next(err));
  
};


/**
 * Get a specific portfolio belonging to a user
 * Example: GET >> /api/portfolios/65a4sd654asd645asd
 * Secured: yes -- valid JWT required
 * Expects: 
 *    1) user _id from JWT
 *    2) portfolio _id from req params
 * Returns: JSON portfolio object
*/
const getOne = (req, res, next) => {

  if (!isOid(req.params.id)) {
    return res.status(400).json({ message: badParamMsg});
  }

  return Portfolios.getOne(req.user._id, req.params.id)
    .then(portfolio => res.status(200).json(portfolio))
    .catch(err => next(err));

};


/**
 * Create a new portfolio
 * Example: POST >> /api/portfolios
 * Secured: yes -- valid JWT required
 * Expects
 *    1) user _id from JWT
 *    2) portfolio name and notes from req body
 * Returns: JSON portfolio object
*/
const create = (req, res, next) => {

  if (!req.body.name) {
    return res.status(400).json({ message: 'Portfolio "name" is required.' });
  }
  
  const notes = req.body.notes || '';

  const newPortfolio = {
    owner : req.user._id,
    name  : req.body.name,
    notes
  };
  
  return Portfolios.create(newPortfolio)
    .then(result => res.status(200).json(result))
    .catch(err => next(err));
  
};


/**
 * Update a user's portfolio
 * Example: PUT >> /api/portfolios/564asd654asd56a4sd
 * Secured: yes -- valid JWT required
 * Expects:
 *    1) user _id from JWT
 *    2) portfolio _id from req params
 *    3) updates from req body
 * Returns: JSON portfolio object
*/
const update = (req, res, next) => {

  if (!isOid(req.params.id)) {
    return res.status(400).json({ message: badParamMsg });
  }

  const filter = {
    owner  : req.user._id,
    pfloId : req.params.id
  };
  
  const updates = {
    name  : req.body.name,
    notes : req.body.notes
  };

  return Portfolios.update(filter, updates)
    .then(result => res.status(200).json(result))
    .catch(err   => next(err));

};


/**
 * Delete a user's portfolio
 * Example: DELETE >> /api/portfolios/564asd654asd56a4sd
 * Secured: yes -- valid JWT required
 * Expects: 
 *    1) user _id from JWT
 *    2) portfolio _id from req params
 * Returns: JSON success message
*/
const deletePortfolio = (req, res, next) => {

  if (!isOid(req.params.id)) {
    return res.status(400).json({ message: badParamMsg });
  }

  return Portfolios.deletePortfolio(req.user._id, req.params._id)
    .then(result => res.status(200).json(result))
    .catch(err => next(err));

};


/**
 * Add holding to portfolio
 * Example: POST >> /api/portfolios/564asd654asd56a4sd/holdings
 * Secured: yes -- valid JWT required
 * Expects:
 *    1) user _id from JWT
 *    2) portfolio _id from req params
 *    3) ticker and qty from req body
 * Returns: JSON portfolio object
*/
const addHolding = async (req, res, next) => {

  if (!req.body.ticker || !req.body.qty) {
    return res.status(400)
      .json({ message: 'Missing required holding details.' });
  }

  if (Number.isNaN(+req.body.qty)) {
    return res.status(400).json({ message: 'Qty must be a number.' });
  }

  if (!isOid(req.params.id)) {
    return res.status(400).json({ message: badParamMsg });
  }

  const owner  = req.user._id;
  const pfloId = req.params.id;
  const ticker = req.body.ticker.toString().trim().toUpperCase();
  const qty    = +req.body.qty;  // coerse to number type

  if (!isTicker(ticker)) {
    return res.status(400).json({ message: badBodyMsg });
  }

  const filter  = { owner, pfloId };
  const updates = { ticker, qty };

  // check if holding already exists
  const holding = await Portfolios.hasHolding(owner, pfloId, ticker);
  if (holding) {
    return res.status(403)
      .json({message: `Holding ${ticker} already exists in portfolio.`});
  }

  return Portfolios.addHolding(filter, updates)
    .then(result => res.status(200).json(result))
    .catch(err   => next(err));

};


/**
 * Update a holding in a user's portfolio
 * Example: PUT >> /api/portfolios/564asd654asd54sd/holdings/65asd64sd564asd564
 * Secured: yes -- valid JWT required
 * Expects: 
 *    1) user _id from JWT
 *    2) portfolio _id from req params
 *    3) holding _id from req params
 *    4) qty from req body
 * Returns: JSON portfolio object
*/
const updateHolding = (req, res, next) => {

  if (!isOid(req.params.pfloId || !isOid(req.params.hldgId))) {
    return res.status(400).json({ message: badParamMsg });
  }

  if (!req.body.qty) {
    return res.status(400).json({ message: 'Missing holding quantity.' });
  }

  if (Number.isNaN(+req.body.qty)) {
    return res.status(400).json({ message: 'Qty must be a number.' });
  }

  const filter = {
    owner  : req.user._id,
    pfloId : req.params.pfloId,
    hldgId : req.params.hldgId
  };

  const qty = +req.body.qty;  // coerce to number type

  return Portfolios.updateHolding(filter, qty)
    .then(result => res.status(200).json(result))
    .catch(err => next(err));

};


/**
 * Delete a holding from a user's portfolio
 * Example: DELETE >> /api/portfolios/564asd654asd4sd/holdings/65asd4sd564asd564
 * Secured: yes -- valid JWT required
 * Expects: 
 *    1) user _id from JWT
 *    2) portfolio _id from req params
 *    3) holding _id from req params
 * Returns: JSON success message
*/
const deleteHolding = (req, res, next) => {

  if (!isOid(req.params.pfloId || !isOid(req.params.hldgId))) {
    return res.status(400).json({ message: badParamMsg });
  }

  const target = {
    owner  : req.user._id,
    pfloId : req.params.pfloId,
    hldgId : req.params.hldgId
  };

  return Portfolios.deleteHolding(target)
    .then(result => res.status(200).json(result))
    .catch(err => next(err));

};


/* ================================ EXPORTS ================================ */

module.exports = {
  getAll,
  getOne,
  create,
  update,
  deletePortfolio,
  addHolding,
  updateHolding,
  deleteHolding
};
