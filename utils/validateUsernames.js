/**
 * Validates username parameters.
 * A valid username is a string consisting of alphanumberic, whitespace,
 * underscrores and periods, less than 32 characters in length.
 * @param    {String}   username   Candidate username to check
 * @returns  {Boolean}             True when username is valid
 * @throws   {Error}               Throws when username is missing or invalid
*/

module.exports = (username) => {
  const rex = /^[\w\s.]{3,32}$/;  

  if (typeof username === 'undefined') {
    throw new Error('Missing required "username" parameter');
  }

  const notString = typeof username !== 'string';
  const isValid   = rex.test(username);

  if (notString || !username.trim().length || !isValid) {
    throw new Error(`Validation Error: Invalid "username": ${username}`);
  }
  
  return true;
};
