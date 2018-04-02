const validateUsernames = require('./validateUsernames');
const validatePwHashes  = require('./validatePwHashes');
const validateObjectIds = require('./validateObjectIds');
const validateTickers   = require('./validateTickers');
const validateNames     = require('./validateNames');
const validateNotes     = require('./validateNotes');
const validateQty       = require('./validateQty');

const defaultSchema = {
  username : validateUsernames,
  pwHash   : validatePwHashes,
  owner    : validateObjectIds,
  pfloId   : validateObjectIds,
  hldgId   : validateObjectIds,
  ticker   : validateTickers,
  name     : validateNames,
  notes    : validateNotes,
  qty      : validateQty
};


module.exports = class ModelParamValidator {

  /** Instantiates validators with passed or default schema
   *  @param   {Object}   schema   Optional custom schema object
  */
  constructor(schema = defaultSchema) {
    this.schema = schema;
  }


  /** Wholesale Model Data Validation Utility
   *  Iterates over params, checking key-value pair each against schema
   *  @param   {Object}   params   Shape { schema_type : value }
   *  @throws  {Error}             Error specific to failed check
   *  @returns {Boolean}           Returns true if all params are valid
  */
  check(params) {
    for (let key in params) {
      this.schema[key](params[key], key);
    }
    return true;
  }

};
