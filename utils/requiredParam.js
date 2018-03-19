/** Throws a specific error.
 *  Used as a default value for model methods.
 *  Credit: https://medium.freecodecamp.org/elegant-patterns-in-modern-javascript-roro-be01e7669cbd
 * 
 *  @param   {*}       param   Paramter that was required
 *  @throws  {Error}           Error w/message including missing param
*/
module.exports = function required(param) {
  const reqParamErr = new Error(`Required parameter "${param}" is missing`);

  // preserve original stack trace
  if (typeof Error.captureStackTrace === 'function') {
    Error.captureStackTrace(reqParamErr, required);
  }

  throw reqParamErr;
};