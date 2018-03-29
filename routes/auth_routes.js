'use strict';

/* ================================= SETUP ================================= */

const router   = require('express').Router();
const authCtrl = require('../controllers/auth');


/* ========================== ROUTE CONTROLLERS ============================ */

router.route('/register')
  .post(authCtrl.register);


router.route('/login')
  .post(authCtrl.login);


/* ================================ EXPORTS ================================ */

module.exports = router;
