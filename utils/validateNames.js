/**
 * Validate portfolio names.
 * Names must be strings; max length 100 characters.
 * @param     {String}   name   Input ticker
 * @returns   {Boolean}         True if name matches pattern
*/
module.exports = (name) => {
  return typeof name === 'string' && name.length <= 100;
};
