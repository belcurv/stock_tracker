const { buildSanitizeFunction } = require('express-validator/filter');
const sanitizeUserInputs = buildSanitizeFunction(['body', 'query', 'params']);


module.exports = ( valuesArray ) => {
   
    return ( req, res, next ) => {
        valuesArray.forEach( val => {
            sanitizeUserInputs( val ).trim()
        } )
        
        next();
    }
}   