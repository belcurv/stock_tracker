/**
 * Validates that a qty exists and is a positive number.
 * @param    {Number}   qty   Candidate qty to check
 * @returns  {Boolean}        True if qty is a positive number
 * @throws   {Error}          Throws if qty is missing or invalid
*/
module.exports = (qty) => {

  if (typeof qty === 'undefined') {
    throw new Error('Missing required "qty" parameter');
  }

  if (typeof qty !== 'number' || qty <= 0) {
    throw new Error(`Validation Error: Invalid "qty": ${qty}`);
  }

  return true;
};
