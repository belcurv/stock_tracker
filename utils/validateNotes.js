/**
 * Validate portfolio notes.
 * Notes must be strings.
 * @param     {String}   notes   Candidate notes to check
 * @returns   {Boolean}          True if notes are valid
 * @throws    {Error}            Throws when "notes" param omitted
*/
module.exports = function(notes) {

  if (typeof notes === 'undefined') {
    throw new Error('Missing required "notes" parameter');
  }

  return typeof notes === 'string';
};
