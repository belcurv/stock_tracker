const { sanitizeBody, sanitize } = require('express-validator/filter');

const { buildSanitizeFunction } = require('express-validator/filter');
const sanitizeUserInputs = buildSanitizeFunction(['body', 'query', 'params']);


module.exports = ( valuesArray ) => {
    return valuesArray.map( val => {
        return sanitizeUserInputs(val)
                    .blacklist( '{}' )   //escapes any chars passed into it
                    .escape()            //escapes HTML chars
    } )
}
