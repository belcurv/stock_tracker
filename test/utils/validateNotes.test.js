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

  it('should throw exception for non-string values', () => {
    const call = function () {
      validateNotes(666);
    };
    assert.throws(call, 'Validation Error: Invalid "notes": 666');
  });

  it('should throw exception for non-string values', () => {
    const call = function () {
      validateNotes(true);
    };
    assert.throws(call, 'Validation Error: Invalid "notes": true');
  });

});
