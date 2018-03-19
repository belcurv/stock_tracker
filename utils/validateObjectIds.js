/**
 * Validates that a paramter is a valid MongoDB ObjectID.
 * A valid MongoDB ObjectID is 12 hex bytes, aka
 * 24 alphanumeric chars 0-9 and a-f.
 * @param    {String}   _id   Candidate _id to check
 * @returns  {Boolean}        True when _id is valid
 * @throws   {Error}          Throws when _id is missing
*/

module.exports = (_id) => {

  if (typeof _id === 'undefined') {
    throw new Error('Missing required "_id" parameter');
  }
  
  const rex = /^[0-9a-fA-F]{24}$/;
  return typeof _id === 'string' && rex.test(_id);
};
