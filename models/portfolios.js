'use strict';

/* ================================= SETUP ================================= */

const ObjectID = require('mongodb').ObjectID;
const db       = require('../db');


/* ============================ PUBLIC METHODS ============================= */

/**
 * Get all of a users portfolios
 * @param    {String}   owner   User _id
 * @returns  {Object}           Promise object + array of portfolios
*/
const getAll = (owner) => {
  const collection = db.get().collection('portfolios');
  const target     = { owner };

  return collection
    .find(target)
    // .sort({ 'updatedAt' : -1 })
    .toArray();

};


/**
 * Get one portfolio
 * @param    {String}   owner   User _id
 * @param    {String}   _id     Portfolio _id
 * @returns  {Object}           Promise object + portfolio
 */
const getOne = (owner, _id) => {
  const collection = db.get().collection('portfolios');
  const target     = {
    _id   : ObjectID(_id),
    owner : owner
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
 * @returns  {Object}           Promise object + new portfolio
*/
const create = ({owner, name, notes}) => {
  if (!owner) { throw new Error('Portfolio "owner" is required.'); }
  if (!name)  { throw new Error('Portfolio "name" is required.'); }

  notes = notes || '';

  const collection = db.get().collection('portfolios');
  const now        = Date.now();
  const document   = { owner, name, notes };
  
  document.holdings  = [];
  document.createdAt = now;
  document.updatedAt = now;

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
*/
const update = ({owner, _id}, {name, notes}) => {
  const collection = db.get().collection('portfolios');
  const filter     = {
    _id   : ObjectID(_id),
    owner : owner
  };
  const updates    = { '$set': {
    name      : name,
    notes     : notes,
    updatedAt : Date.now()
  }};
  const options    = {
    returnOriginal: false
  };

  return collection
    .findOneAndUpdate(filter, updates, options)
    .then(result => result.value);

};


/**
 * Delete a user's portfolio
 * @param    {String}   owner   User _id
 * @param    {String}   _id     Portfolio _id
*/
const deletePortfolio = (owner, _id) => {
  const collection = db.get().collection('portfolios');
  const target     = {
    _id   : ObjectID(_id),
    owner : owner
  };

  return collection
    .deleteOne(target);

};


/**
 * Add holding to portfolio
 * @param    {String}   owner    User _id
 * @param    {String}   _id      Portfolio _id
 * @param    {String}   ticker   Holding's ticker symbol
 * @param    {Number}   qty      Qty of shares owned
 * @returns
*/
const addHolding = ({owner, _id}, {ticker, qty}) => {
  const collection = db.get().collection('portfolios');
  const now = Date.now();
  const filter     = {
    _id   : ObjectID(_id),
    owner : owner
  };
  const updates    = {
    '$push': {
      holdings: {
        _id: ObjectID(),
        ticker,
        qty,
        createdAt: now,
        updatedAt: now
      }
    }
  };
  const options    = {
    returnOriginal: false
  };

  return collection
    .findOneAndUpdate(filter, updates, options)
    .then(result => result.value);

};


/**
 * Update a holding in a user's portfolio
 * @param    {String}   owner    User _id
 * @param    {String}   _id      Portfolio _id
 * @param    {String}   ticker   Holding's ticker symbol
 * @param    {Number}   qty      Qty of shares owned
 * @returns
*/
const updateHolding = () => {
  
};


/**
 * Delete a holding from a user's portfolio
 * @param    {String}   owner    User _id
 * @param    {String}   _id      Portfolio _id
 * @param    {String}   ticker   Holding's ticker symbol
 * @returns
*/
const deleteHolding = () => {
  
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
