'use strict';

/* ================================= SETUP ================================= */

const router        = require('express').Router();
const verifyJWT     = require('../middleware/verifyJWT');
const porfoliosCtrl = require('../controllers/portfolios');
const usersCtrl     = require('../controllers/users');

/* ============================== MIDDLEWARE =============================== */

/**
 * All routes in this module are secured w/JWT and use following middleware
*/
router.use(verifyJWT);


/* ================================ ROUTES ================================= */

router.route('/portfolios')
  .get(porfoliosCtrl.getAll)
  .post(porfoliosCtrl.create);


router.route('/portfolios/:id')
  .get(porfoliosCtrl.getOne)
  .put(porfoliosCtrl.update)
  .delete(porfoliosCtrl.deletePortfolio);


router.route('/portfolios/:id/holdings')
  .post(porfoliosCtrl.addHolding);


router.route('/portfolios/:pfloId/holdings/:hldgId')
  .put(porfoliosCtrl.updateHolding)
  .delete(porfoliosCtrl.deleteHolding);


router.route('/users/:id')
  .get(usersCtrl.getOne)
  .delete(usersCtrl.deleteUser);


/* ================================ EXPORTS ================================ */

module.exports = router;
