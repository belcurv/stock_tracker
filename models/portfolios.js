'use strict';

/* ================================= SETUP ================================= */

const sanitize = require('../utils/sanitizeMongoQuery');
const ObjectID = require('mongodb').ObjectID;
const db       = require('../db');


/* ============================ PUBLIC METHODS ============================= */

/**
 * Get all of a users portfolios
 * @param    {String}   owner   User _id
 * @returns  {Object}           Promise + array of portfolios
*/
const getAll = (owner) => {

  if (!owner || typeof owner !== 'string') {
    return Promise.reject('missing or invalid owner `_id`');
  }

  const collection = db.get().collection('portfolios');
  const target     = { owner };

  return collection
    .find(target)
    .sort({ 'updatedAt' : -1 })
    .toArray();

};


/**
 * Get one portfolio
 * @param    {String}   owner   User _id
 * @param    {String}   _id     Portfolio _id
 * @returns  {Object}           Promise + portfolio
 */
const getOne = (owner, _id) => {

  if (!owner || typeof owner !== 'string') {
    return Promise.reject('missing or invalid owner `_id`');
  }

  if (!_id || typeof _id !== 'string') {
    return Promise.reject('missing or invalid portfolio `_id`');
  }

  const collection = db.get().collection('portfolios');
  const target     = {
    _id : ObjectID(_id),
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
 * @param    {String}   notes   Notes about the portfolio
 * @returns  {Object}           Promise + new portfolio
*/
const create = ({owner, name, notes}) => {

  notes = notes || '';

  if (!owner || typeof owner !== 'string') {
    return Promise.reject('missing or invalid portfolio `owner`');
  }

  if (!name || typeof name !== 'string') {
    return Promise.reject('missing or invalid portfolio `name`');
  }

  if (typeof notes !== 'string') {
    return Promise.reject('Portfolio `notes` must be a string');
  }

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
 * @param    {String}   owner   User _id
 * @param    {String}   _id     Portfolio _id
 * @param    {String}   name    Portfolio name
 * @param    {String}   notes   Notes about the portfolio
 * @returns  {Object}           Promise + updated portfolio
*/
const update = ({owner, _id}, {name, notes}) => {

  if (!owner || typeof owner !== 'string') {
    return Promise.reject('missing or invalid portfolio `owner`');
  }
 
  if (!_id || typeof _id !== 'string') {
    return Promise.reject('missing or invalid portfolio `_id`');
  }

  if ((name && typeof name !== 'string') || (notes && typeof notes !== 'string')) {
    return Promise.reject('invalid portfolio update properties');
  }

  const collection = db.get().collection('portfolios');
  
  const filter = {
    _id   : ObjectID(_id),
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
 * @param    {String}   owner   User _id
 * @param    {String}   _id     Portfolio _id
 * @returns  {Object}           Promise
*/
const deletePortfolio = (owner, _id) => {

  if (!owner || typeof owner !== 'string') {
    return Promise.reject('missing or invalid portfolio `owner`');
  }

  if (!_id || typeof _id !== 'string') {
    return Promise.reject('missing or invalid portfolio `_id`');
  }

  const collection = db.get().collection('portfolios');
  const target     = {
    _id   : ObjectID(_id),
    owner : owner
  };

  return collection
    .deleteOne(target);

};


/**
 * Check if a portfolio has a specific holding
 * @param    {String}   owner    User _id
 * @param    {String}   _id      Portfolio _id
 * @param    {String}   ticker   Holding's ticker symbol
 * @returns  {Boolean}           True if portfolio contains specified holding
*/
const hasHolding = (owner, _id, ticker) => {

  if (!owner || typeof owner !== 'string') {
    return Promise.reject('missing or invalid portfolio `owner`');
  }

  if (!_id || typeof _id !== 'string') {
    return Promise.reject('missing or invalid portfolio `_id`');
  }
  
  if (!ticker || typeof ticker !== 'string') {
    return Promise.reject('missing or invalid portfolio `ticker`');
  }

  const collection = db.get().collection('portfolios');

  const target = {
    _id               : ObjectID(_id),
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
 * @param    {String}   _id      Portfolio _id
 * @param    {String}   ticker   Holding's ticker symbol
 * @param    {Number}   qty      Qty of shares owned
 * @returns  {Object}            Promise + updated portfolio
*/
const addHolding = ({owner, _id}, {ticker, qty}) => {

  if (!owner || typeof owner !== 'string') {
    return Promise.reject('missing or invalid portfolio `owner`');
  }

  if (!_id || typeof _id !== 'string') {
    return Promise.reject('missing or invalid portfolio `_id`');
  }

  if (!ticker || typeof ticker !== 'string') {
    return Promise.reject('missing or invalid portfolio `ticker`');
  }

  const collection = db.get().collection('portfolios');
  const now = Date.now();

  const filter = {
    _id   : ObjectID(_id),
    owner : owner
  };
  
  const updates = {
    '$push': {
      holdings : {
        _id       : ObjectID(),
        ticker    : sanitize(ticker),
        createdAt : now,
        updatedAt : now,
        qty
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

  if (!owner || typeof owner !== 'string') {
    return Promise.reject('missing or invalid `owner`');
  }

  if (!pfloId || typeof pfloId !== 'string') {
    return Promise.reject('missing or invalid portfolio `_id`');
  }

  if (!hldgId || typeof hldgId !== 'string') {
    return Promise.reject('missing or invalid holding `_id`');
  }

  if (!qty || typeof qty !== 'number') {
    return Promise.reject('missing or invalid `qty`');
  }

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

  if (!owner || typeof owner !== 'string') {
    return Promise.reject('missing or invalid portfolio `owner`');
  }

  if (!pfloId || typeof pfloId !== 'string') {
    return Promise.reject('missing or invalid portfolio `_id`');
  }

  if (!hldgId || typeof hldgId !== 'string') {
    return Promise.reject('missing or invalid holding `_id`');
  }

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
