/**
 * Validate portfolio names.
 * Names must be strings of between 1 - 100 characters.
 * @param     {String}   name   Candidate portfolio name to test
 * @returns   {Boolean}         True if valid
 * @throws    {Error}           Throws if "name" omitted
*/
module.exports = (name) => {

  if (typeof name === 'undefined') {
    throw new Error('Missing required "name" parameter');
  } else if (typeof name === 'string') {
    return name.trim().length > 0 && name.length <= 100;
  }

  return false;
  
};
