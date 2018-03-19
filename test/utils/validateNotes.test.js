/* globals describe it */

/* ================================= SETUP ================================= */

const { assert }    = require('chai');
const validateNotes = require('../../utils/validateNotes');


/* ================================= TESTS ================================= */

describe('Utility: validateNotes', () => {

  it('should be a function', () => {
    assert.isFunction(validateNotes);
  });

  it('should return true for "This portfolio has fleas"', () => {
    assert.isTrue(validateNotes('This portfolio has fleas'));
  });

  it('should return true for "Warhammer 40k"', () => {
    assert.isTrue(validateNotes('Warhammer 40k'));
  });

  it('should return false non-string values', () => {
    assert.isFalse(validateNotes(666));
  });

  it('should return false non-string values', () => {
    assert.isFalse(validateNotes(true));
  });

  it('should throw exception if "notes" param omitted', () => {
    assert.throws(validateNotes, /Missing required "notes" parameter/);
  });

});
