/**
 * Verify JWT token
*/

const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const secret     = process.env.JWT_SECRET;
  const authHeader = req.headers.authorization;
  const headerRex  = /^Bearer\s{1}[\w\-.]+$/;

  if (!authHeader) {
    return next(new Error('Missing components for JWT verification'));
  }

  if (!headerRex.test(authHeader)) {
    return next(new Error('Expected Authorization header: "Bearer <token>"'));
  }

  const token = authHeader.split(' ')[1];

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