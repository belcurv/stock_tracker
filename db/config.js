require('dotenv').config();

module.exports = {

  development : {
    url    : `mongodb://${process.env.DB_URL}:${process.env.DB_PORT}`,
    dbName : process.env.DEV_DB_NAME
  },

  testing : {
    url    : `mongodb://${process.env.DB_URL}:${process.env.DB_PORT}`,
    dbName : process.env.TESTING_DB_NAME
  },

  production : {
    url    : null, // doesn't exist yet!
    dbName : null
  }

};
