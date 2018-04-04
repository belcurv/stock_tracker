'use strict';

/* ================================= SETUP ================================= */

const Users = require('../models/users');


/* ========================== ROUTE CONTROLLERS ============================ */

/**
 * Get user's own profile
 * Example: GET >> /api/users/321asd654asd321asd654asd
 * Secured: yes -- valid JWT required
 * Expects:
 *    1) user _id from JWT
 *    2) user _id from request param
 * Returns: JSON user object
*/
const getOne = (req, res, next) => {

  if (req.user._id !== req.params.id) {
    return res.status(400).json({ message : 'Missing or invalid user params' });
  }

  return Users.findById(req.user._id)
    .then(user => res.status(200).json(user))
    .catch(err => next(err));

};


/**
 * Delete a user's profile
 * Example: DELETE >> /api/users/321asd654asd321asd654asd
 * Secured: yes -- valid JWT required
 * Expects:
 *    1) user _id from JWT
 *    2) user _id from request param
 * Returns: JSON success message
*/
const deleteUser = (req, res, next) => {

  if (req.user._id !== req.params.id) {
    return res.status(400).json({ message : 'Missing or invalid user params' });
  }

  return Users.deleteOne(req.user._id)
    .then(({ deletedCount }) => {
      if (deletedCount > 0) {
        return res.status(200).json({ message : 'User deleted' });
      } else {
        return res.status(404).json({ message : 'User not found' });
      }
    })
    .catch(err   => next(err));


};


/* ================================ EXPORTS ================================ */

module.exports = {
  getOne,
  deleteUser
};