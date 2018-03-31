/**
 * Validate stock ticker strings.
 * Valid tickers are Strings with 1-5 uppercase, alpha-numeric characters.
 * @param     {String}   ticker   Candidate ticker to check
 * @returns   {Boolean}           True if ticker valid
 * @throws    {Error}             Throws if ticker missing or invalid
*/
module.exports = (ticker) => {
  const rex = /^[0-9A-Z]{1,5}$/;

  if (typeof ticker === 'undefined') {
    throw new Error('Missing required "ticker" parameter');
  }

  if (typeof ticker !== 'string' || !rex.test(ticker)) {
    throw new Error(`Validation Error: Invalid "ticker": ${ticker}`);
  }

  return true;
};
