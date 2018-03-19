/**
 * Validates that a qty is a positive number.
 * @param    {Number}   qty   Candidate qty to check
 * @returns  {Boolean}        True if qty is a positive number
 * @throws   {Error}          Throws if qty is missing
*/

module.exports = (qty) => {

  if (typeof qty === 'undefined') {
    throw new Error('Missing required "qty" parameter');
  }

  return typeof qty === 'number' && qty >= 0;
};
