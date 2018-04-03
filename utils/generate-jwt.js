const jwt = require('jsonwebtoken');

/**
 * Generate a signed JWT token
 * @param    {Object}   payload   Object we want to encode
 * @returns  {String}             Signed JWT token
*/
module.exports = async (payload) => {
  return await jwt.sign(
    { user : payload },           // payload
    process.env.JWT_SECRET,       // secret
    { expiresIn : '7d' }          // options
  );
};
