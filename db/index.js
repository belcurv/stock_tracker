/* ================================= SETUP ================================= */

const MongoClient = require('mongodb').MongoClient;

// init module-scope state container
const state = {
  db : null
};


/* ============================ PUBLIC METHODS ============================= */

/**
 * Connect to a specified database
 * @param   {String}    url    Database connection url
 * @param   {String}    url    Database name
 * @param   {Function}  done   Callback
*/
const connect = (url, dbName, done) => {
  if (state.db) { return done(); }
  
  MongoClient.connect(url, (err, client) => {
    if (err) { return done(err); }
    state.db = client.db(dbName);
    state.client = client;
    done();
  });

};


/**
 * Get the database connection object
 * @returns   {Object}   The database connection object from 'state'
*/
const get = () => {
  return state.db;
};


/**
 * Close a database connection
 * @param   {function}   done   Callback
*/
const close = (done) => {
  if (state.client) {
    state.client.close();
    state.db     = null;
    state.client = null;
    done();
  }

};

/* ================================ EXPORTS ================================ */

module.exports = { connect, get, close };
