/**
 * Validate stock ticker strings.
 * Assumes no more than 5 uppercase, alpha-numeric characters.
 * @param     {String}   ticker   Input ticker
 * @returns   {Boolean}           True if ticker matches pattern
*/
module.exports = (ticker) => {
  const rex = /^[0-9A-Z]{4,5}$/;
  return typeof ticker === 'string' && rex.test(ticker);
};
