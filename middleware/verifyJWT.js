/**
 * Verify JWT token
*/

const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.headers.authorization;
  const secret = process.env.JWT_SECRET;

  // fail if missing required pieces
  if (!token || !secret) {
    return next(new Error('Missing components for JWT verification'));
  }

  jwt.verify(token, secret, (err, decoded) => {
    if (err) {
      return next(new Error(err.message));
    }

    if (decoded.user._id && decoded.user.username) {
      // OK. Set req.user
      req.user = decoded.user;
      next();
    } else {
      return next(new Error('Missing required user attributes'));
    }

  });

};