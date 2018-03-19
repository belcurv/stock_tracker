const validateObjectIds = require('./validateObjectIds');
const validateTickers   = require('./validateTickers');
const validateNames     = require('./validateNames');
const validateNotes     = require('./validateNotes');
const validateQty       = require('./validateQty');

const schema = {
  _id    : validateObjectIds,
  hldgId : validateObjectIds,
  owner  : validateObjectIds,
  pfloId : validateObjectIds,
  ticker : validateTickers,
  name   : validateNames,
  notes  : validateNotes,
  qty    : validateQty
};

/** Wholesale Model Data Validation Utility
 *  Loops over array of params, checking each against schema
 * 
 *  @param   {Array}  paramsList   Array of arrays of key value pairs
 *  @throws  {Error}               Error specific to failed check
 *  @returns {Boolean}             Returns true if all params are valid
*/
module.exports = function(paramsList) {

  for (let i = 0; i < paramsList.length; i += 1) {
    let type  = paramsList[i].type;
    let input = paramsList[i].value;
    if (!schema[type](input)) {
      throw new Error(`Invalid parameter "${type}"`);
    }
  }

  return true;

};
