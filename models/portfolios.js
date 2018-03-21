'use strict';

/* ================================= SETUP ================================= */

const ObjectID  = require('mongodb').ObjectID;
const db        = require('../db');

const sanitize  = require('../utils/sanitizeMongoQuery');
const Validator = require('../utils/validateModelParams');
const validate  = new Validator();


/* ============================ PUBLIC METHODS ============================= */

/**
 * Get all of a users portfolios
 * @param    {String}   owner   User _id
 * @returns  {Object}           Promise + array of portfolios
*/
const getAll = (owner) => {

  validate.check({ owner });

  const collection = db.get().collection('portfolios');
  const target     = { owner };

  return collection
    .find(target)
    .sort({ 'updatedAt' : -1 })
    .toArray();

};


/**
 * Get one portfolio
 * @param    {String}   owner    User _id
 * @param    {String}   pfloId   Portfolio _id
 * @returns  {Object}            Promise + portfolio
 */
const getOne = (owner, pfloId) => {

  validate.check({ owner, pfloId });

  const collection = db.get().collection('portfolios');
  const target     = {
    _id : ObjectID(pfloId),
    owner
  };
  
  return collection
    .findOne(target)
    .then(portfolio => portfolio);
  
};


/**
 * Create a new portfolio
 * @param    {String}   owner   User _id
 * @param    {String}   name    Portfolio name
 * @param    {String}   notes   Optional notes about the portfolio
 * @returns  {Object}           Promise + new portfolio
*/
const create = ({ owner, name, notes }) => {

  notes = notes || '';

  validate.check({ owner, name, notes });

  const collection = db.get().collection('portfolios');
  const now        = Date.now();
  const document   = {
    owner,
    name      : sanitize(name).toString().trim(),
    notes     : sanitize(notes).toString().trim(),
    holdings  : [],
    createdAt : now,
    updatedAt : now
  };

  return collection
    .insertOne(document)
    .then(result => result.ops[0]);

};


/**
 * Update a portfolio
 * @param    {String}   owner    User _id
 * @param    {String}   pfloId   Portfolio _id
 * @param    {String}   name     Portfolio name
 * @param    {String}   notes    Notes about the portfolio
 * @returns  {Object}            Promise + updated portfolio
*/
const update = ({ owner, pfloId }, { name, notes }) => {

  validate.check({ owner, pfloId, name, notes });

  const collection = db.get().collection('portfolios');
  
  const filter = {
    _id   : ObjectID(pfloId),
    owner : owner
  };
  
  const updates = { updatedAt: Date.now() };
  if (name)  { updates.name  = sanitize(name).toString().trim();  }
  if (notes) { updates.notes = sanitize(notes).toString().trim(); }
  
  const options = { returnOriginal: false };

  return collection
    .findOneAndUpdate(filter, { '$set': updates }, options)
    .then(result => result.value);

};


/**
 * Delete a user's portfolio
 * @param    {String}   owner    User _id
 * @param    {String}   pfloId   Portfolio _id
 * @returns  {Object}            Promise
*/
const deletePortfolio = (owner, pfloId) => {

  validate.check({ owner, pfloId });

  const collection = db.get().collection('portfolios');
  const target = {
    _id   : ObjectID(pfloId),
    owner : owner
  };

  return collection
    .deleteOne(target);

};


/**
 * Check if a portfolio has a specific holding
 * @param    {String}   owner    User _id
 * @param    {String}   pfloId   Portfolio _id
 * @param    {String}   ticker   Holding's ticker symbol
 * @returns  {Boolean}           True if portfolio contains specified holding
*/
const hasHolding = (owner, pfloId, ticker) => {

  validate.check({ owner, pfloId, ticker });

  const collection = db.get().collection('portfolios');

  const target = {
    _id               : ObjectID(pfloId),
    owner             : owner,
    'holdings.ticker' : sanitize(ticker).toString().trim()
  };
  
  return collection
    .find(target)
    .count()
    .then(count => count > 0 ? true : false);

};


/**
 * Add holding to portfolio
 * @param    {String}   owner    User _id
 * @param    {String}   pfloId   Portfolio _id
 * @param    {String}   ticker   Holding's ticker symbol
 * @param    {Number}   qty      Qty of shares owned
 * @returns  {Object}            Updated portfolio; holdings sorted by ticker
*/
const addHolding = ({ owner, pfloId }, { ticker, qty }) => {

  validate.check({ owner, pfloId, ticker, qty });

  const collection = db.get().collection('portfolios');
  const now = Date.now();

  const filter = {
    _id   : ObjectID(pfloId),
    owner : owner
  };
  
  const updates = {
    '$push': {
      holdings : {
        $each: [{
          _id       : ObjectID(),
          ticker    : sanitize(ticker),
          createdAt : now,
          updatedAt : now,
          qty
        }],
        $sort: { ticker: 1 }
      }
    },
    '$set': {
      updatedAt: Date.now()
    }
  };
  
  const options = { returnOriginal: false };

  return collection
    .findOneAndUpdate(filter, updates, options)
    .then(result => result.value);

};


/**
 * Update a holding in a user's portfolio
 * @param    {String}   owner    User _id
 * @param    {String}   pfloId   Portfolio _id
 * @param    {String}   hldgId   Holding _id
 * @param    {Number}   qty      Qty of shares owned
 * @returns  {Object}            Promise + updated portfolio
*/
const updateHolding = ({ owner, pfloId, hldgId }, qty) => {

  validate.check({ owner, pfloId, hldgId, qty });

  const collection = db.get().collection('portfolios');

  const filter = {
    _id: ObjectID(pfloId),
    owner,
    'holdings._id': ObjectID(hldgId)
  };

  const updates = {
    '$set': {
      'holdings.$.qty': qty,
      'holdings.$.updatedAt': Date.now()
    }
  };

  const options = { returnOriginal: false };

  return collection
    .findOneAndUpdate(filter, updates, options)
    .then(result => result.value);

};


/**
 * Delete a holding from a user's portfolio
 * @param    {String}   owner    User _id
 * @param    {String}   pfloId   Portfolio _id
 * @param    {String}   hldgId   Holding _id
 * @returns  {Object}            Promise + updated portfolio
*/
const deleteHolding = ({ owner, pfloId, hldgId }) => {

  validate.check({ owner, pfloId, hldgId });

  const collection = db.get().collection('portfolios');

  const filter = {
    _id: ObjectID(pfloId),
    owner,
    'holdings._id': ObjectID(hldgId)
  };

  const updates = {
    '$pull': {
      holdings: { _id: ObjectID(hldgId) }
    }
  };

  const options = { returnOriginal: false };

  return collection
    .findOneAndUpdate(filter, updates, options)
    .then(result => result.value);
  
};


/* ================================ EXPORTS ================================ */

module.exports = {
  getAll,
  getOne,
  create,
  update,
  deletePortfolio,
  hasHolding,
  addHolding,
  updateHolding,
  deleteHolding
};
