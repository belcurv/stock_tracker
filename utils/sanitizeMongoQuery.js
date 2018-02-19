/**
 * Prevents MongoDB query injection attacks by deleting object
 * keys that begin with '$'.
 * Credit: https://github.com/vkarpov15/mongo-sanitize
 * @param    {*}   input   The input thing
 * @returns  {*}           Input, or sanitized object if input was an object
*/

module.exports = function (input) {
  if (input instanceof Object) {
    for (let key in input) {
      if (/^\$/.test(key)) {
        delete input[key];
      }
    }
  }
  return input;
};
