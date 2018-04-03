/**
 * Validates email addresses.
 * Most probably not RFC spec compliant.
 * A valid email is a string consisting of alphanumberic characters,
 * dashes and underscrores, numbers, with an @ sign and a domain name.
 * @param    {String}   email   Candidate email to check
 * @returns  {Boolean}          True when email is valid
 * @throws   {Error}            Throws when email is missing or invalid
*/
module.exports = function (email) {
  const emailRex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,4})+$/;

  if (typeof email === 'undefined') {
    throw new Error('Missing required "email" parameter');
  }

  const notString = typeof email !== 'string';
  const isValid   = emailRex.test(email);

  if (notString || !email.trim().length || !isValid) {
    throw new Error(`Validation Error: Invalid "email": ${email}`);
  }

  return true;
};
