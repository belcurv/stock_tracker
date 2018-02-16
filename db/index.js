/* ================================= SETUP ================================= */

const MongoClient = require('mongodb').MongoClient;

// init module-scope state container
const state = {
  db : null
};


/* ============================ PUBLIC METHODS ============================= */

/**
 * Connect to a specified database
 * @param   {String}    url    Database connection path string
 * @param   {Function}  done   Callback
*/
const connect = (url, done) => {
  if (state.db) { return done(); }

  MongoClient.connect(url, (err, db) => {
    if (err) { return done(err); }
    state.db = db;
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
  if (state.db) {
    state.db.close((err, result) => {
      if (err) { return done(err); }
      state.db   = null;
      state.mode = null;
      done();
    });
  }

};

/* ================================ EXPORTS ================================ */

module.exports = { connect, get, close };
