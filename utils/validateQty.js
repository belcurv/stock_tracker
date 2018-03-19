/**
 * Validates that a qty is a positive number.
 * @param    {Number}   qty   Input qty to check
 * @returns  {Boolean}        True if positive number.
*/

module.exports = (qty) => {
  return typeof qty === 'number' && qty >= 0;
};
