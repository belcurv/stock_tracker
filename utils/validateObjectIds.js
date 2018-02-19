/**
 * Validates that a string is a valid MongoDB ObjectID.
 * A valid MongoDB ObjectID is 12 hex bytes.
 * We're looking for a string with 24 alphanumeric chars 0-9 and a-f.
 * @param    {String}   str   Input string to check
 * @returns  {Boolean}        True if string fits the ObjectID pattern.
*/

module.exports = (str) => {
  const rex = /^[0-9a-fA-F]{24}$/;
  return typeof str === 'string' && rex.test(str);
};
