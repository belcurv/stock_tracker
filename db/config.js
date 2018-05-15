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
    url    : `mongodb://${process.env.PROD_DB_USER}:${process.env.PROD_DB_PASS}@${process.env.PROD_DB_URL}:${process.env.PROD_DB_PORT}`,
    dbName : process.env.PROD_DB_NAME
  }

};
