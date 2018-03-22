/** Validates that a paramter is a valid MongoDB ObjectID.
 *  A valid MongoDB ObjectID is 12 hex bytes, aka
 *  24 alphanumeric chars 0-9 and a-f.
 *  @param    {String}   _id          Candidate _id to check
 *  @param    {String}   schemaType   Optional type to add error specificity
 *  @returns  {Boolean}               True when _id is valid
 *  @throws   {Error}                 Throws when _id is missing or invalid
*/
module.exports = (_id, schemaType) => {
  const rex = /^[0-9a-fA-F]{24}$/;

  if (typeof _id === 'undefined') {
    throw new Error(`Missing required "${schemaType}" parameter`);
  }

  if (typeof _id !== 'string' || !rex.test(_id)) {
    throw new Error(`Validation Error: Invalid "${schemaType}": ${_id}`);
  }
  
  return true;
};
