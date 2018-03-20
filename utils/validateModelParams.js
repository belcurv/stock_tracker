const validateObjectIds = require('./validateObjectIds');
const validateTickers   = require('./validateTickers');
const validateNames     = require('./validateNames');
const validateNotes     = require('./validateNotes');
const validateQty       = require('./validateQty');

const defaultSchema = {
  _id    : validateObjectIds,
  hldgId : validateObjectIds,
  owner  : validateObjectIds,
  pfloId : validateObjectIds,
  ticker : validateTickers,
  name   : validateNames,
  notes  : validateNotes,
  qty    : validateQty
};


module.exports = class ModelParamValidator {
  
  /** Instantiates validators with passed or default schema
   * 
   *  @param   {Object}   schema   Optional custom schema object
  */
  constructor(schema = defaultSchema) {
    this.schema = schema;
  }
  
  /** Wholesale Model Data Validation Utility
   *  Loops over array of params, checking each against schema
   * 
   *  @param   {Array}    params   Array of arrays of key value pairs
   *  @throws  {Error}             Error specific to failed check
   *  @returns {Boolean}           Returns true if all params are valid
  */
  check(params) {
    for (let param of params) {
      let type  = param.type;
      let value = param.value;
      if (!this.schema[type](value)) {
        throw new Error(`Validation Error: Invalid "${type}": ${value}`);
      }
    }
    return true;
  }

};
