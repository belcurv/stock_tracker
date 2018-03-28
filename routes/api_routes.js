'use strict';

/* ================================= SETUP ================================= */

const router    = require('express').Router();
const verifyJWT = require('../middleware/verifyJWT');
const pflosCtrl = require('../controllers/portfolios');

/* ============================== MIDDLEWARE =============================== */

router.use(verifyJWT);


/* ========================== ROUTE CONTROLLERS ============================ */

/**
 * Get all user's portfolios
 * Example: GET >> /api/portfolios
 * Secured: yes -- valid JWT required
 * Expects: 
 *    1) user _id from valid JWT
 * Returns: JSON array of portfolio objects
*/
router.get('/portfolios', pflosCtrl.getAll);


/**
 * Get a specific portfolio belonging to a user
 * Example: GET >> /api/portfolios/65a4sd654asd645asd
 * Secured: yes -- valid JWT required
 * Expects: 
 *    1) user _id from JWT
 *    2) portfolio _id from req params
 * Returns: JSON portfolio objects
*/
router.get('/portfolios/:id', pflosCtrl.getOne);


/**
 * Create a new portfolio
 * Example: POST >> /api/portfolios
 * Secured: yes -- valid JWT required
 *    1) user _id from JWT
 *    2) portfolio name from req body
 * Returns: JSON portfolio object
*/
router.post('/portfolios', pflosCtrl.create);


/**
 * Update a user's portfolio
 * Example: PUT >> /api/portfolios/564asd654asd56a4sd
 * Secured: yes -- valid JWT required
 * Expects:
 *    1) user _id from JWT
 *    2) portfolio _id from req params
 *    3) updates from req body
 * Returns: JSON portfolio object
*/
router.put('/portfolios/:id', pflosCtrl.update);


/**
 * Delete a user's portfolio
 * Example: DELETE >> /api/portfolios/564asd654asd56a4sd
 * Secured: yes -- valid JWT required
 * Expects: 
 *    1) user _id from JWT
 *    2) portfolio _id from req params
 * Returns: JSON success message
*/
router.delete('/portfolios/:id', pflosCtrl.deletePortfolio);


/**
 * Add holding to portfolio
 * Example: POST >> /api/portfolios/564asd654asd56a4sd/holdings
 * Secured: yes -- valid JWT required
 * Expects:
 *    1) user _id from JWT
 *    2) portfolio _id from req params
 *    3) ticker and qty from req body
 * Returns: JSON portfolio object
*/
router.post('/portfolios/:id/holdings', pflosCtrl.addHolding);


/**
 * Update a holding in a user's portfolio
 * Example: PUT >> /api/portfolios/564asd654asd54sd/holdings/65asd64sd564asd564
 * Secured: yes -- valid JWT required
 * Expects: 
 *    1) user _id from JWT
 *    2) portfolio _id from req params
 *    3) holding _id from req params
 *    4) qty from req body
 * Returns: JSON portfolio object
*/
router.put('/portfolios/:pfloId/holdings/:hldgId', pflosCtrl.updateHolding);


/**
 * Delete a holding from a user's portfolio
 * Example: DELETE >> /api/portfolios/564asd654asd4sd/holdings/65asd4sd564asd564
 * Secured: yes -- valid JWT required
 * Expects: 
 *    1) user _id from JWT
 *    2) portfolio _id from req params
 *    3) holding _id from req params
 * Returns: JSON success message
*/
router.delete('/portfolios/:pfloId/holdings/:hldgId', pflosCtrl.deleteHolding);


/* ================================ EXPORTS ================================ */

module.exports = router;
