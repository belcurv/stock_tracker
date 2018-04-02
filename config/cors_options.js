/**
 * CORS configuration object
 * For options, see: https://github.com/expressjs/cors
 *
 *  ** UPDATE 'origin' ARRAY WHEN REAL CLIENT(S) DEPLOYED
 */
module.exports = {
  origin : [
    /^http:\/\/localhost(:[0-9]{0,4})?\/?$/
  ],
  methods              : ['GET', 'PUT', 'POST', 'DELETE'],
  exposedHeaders       : ['Access-Control-Allow-Origin'],
  optionsSuccessStatus : 200
};
