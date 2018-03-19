/**
 * Validate stock ticker strings.
 * Valid tickers are Strings with 1-5 uppercase, alpha-numeric characters.
 * @param     {String}   ticker   Candidate ticker to check
 * @returns   {Boolean}           True if ticker valid
 * @throws    {Error}             Throws when ticker missing
*/
module.exports = (ticker) => {

  if (typeof ticker === 'undefined') {
    throw new Error('Missing required "ticker" parameter');
  }

  const rex = /^[0-9A-Z]{1,5}$/;
  return typeof ticker === 'string' && rex.test(ticker);
};
