/* ================================= SETUP ================================= */

const MongoClient  = require('mongodb').MongoClient;
const environment  = process.env.NODE_ENV || 'development';
const config       = require('./config')[environment];

// init module-scope state container
const state = {
  db     : null,
  client : null
};


/* ============================ PUBLIC METHODS ============================= */

/**
 * Connect to a specified database
 * @param   {Function}  done   Callback
*/
const connect = (done) => {
  if (state.db) { return done(); }
  
  MongoClient.connect(config.url, (err, client) => {
    if (err) { return done(err); }
    state.db = client.db(config.dbName);
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
