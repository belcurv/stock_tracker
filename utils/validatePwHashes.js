/** Validates bcrypt password hashes
 *  A valid hash is a String, 60 characters total, and starts with "$2a$10$"
 *  @param    {String}   pwHash   Candidate hash to check
 *  @returns  {Boolean}           True when pwHash is valid
 *  @throws   {Error}             Throws when pwHash is missing or invalid
*/
module.exports = function (pwHash) {

  const rex = /\$2a\$10\$.{53}$/;

  if (typeof pwHash === 'undefined') {
    throw new Error('Missing required "pwHash" parameter');
  }

  if (typeof pwHash !== 'string' || !rex.test(pwHash)) {
    throw new Error(`Validation Error: Invalid "pwHash": ${pwHash}`);
  }

  return true;

};
