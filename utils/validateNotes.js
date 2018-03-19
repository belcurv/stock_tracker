/**
 * Validate portfolio notes.
 * Notes must be strings.
 * @param     {String}   notes   Input notes
 * @returns   {Boolean}          True if notes match pattern
*/
module.exports = function(notes) {
  return typeof notes === 'string';
};
