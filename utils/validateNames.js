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
  } 
  
  if (typeof name !== 'string' || !name.trim().length || name.length > 100) {
    throw new Error(`Validation Error: Invalid "name": ${name}`);
  }

  return true;
  
};
