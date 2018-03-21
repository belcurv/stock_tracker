/**
 * Validate portfolio notes.
 * Notes are not required but must be strings.
 * @param     {String}   notes   Candidate notes to check
 * @returns   {Boolean}          True if notes are valid
 * @throws    {Error}            Throws when "notes" param invalid
*/
module.exports = function(notes) {

  if (typeof notes !== 'string') {
    throw new Error(`Validation Error: Invalid "notes": ${notes}`);
  }

  return true;
};
