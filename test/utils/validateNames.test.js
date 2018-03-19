/* globals describe it */

/* ================================= SETUP ================================= */

const { assert }    = require('chai');
const validateNames = require('../../utils/validateNames');


/* ================================= TESTS ================================= */

describe('Utility: validateNames', () => {

  it('should be a function', () => {
    assert.isFunction(validateNames);
  });

  it('should return true for "My dog has flees"', () => {
    assert.isTrue(validateNames('My dog has flees'));
  });

  it('should return true for "Blade Runner 2049"', () => {
    assert.isTrue(validateNames('Blade Runner 2049'));
  });

  it('should return false for non-String params', () => {
    assert.isFalse(validateNames(666));
  });

  it('should return false for non-String params', () => {
    assert.isFalse(validateNames(true));
  });

  it('should return false for empty strings', () => {
    assert.isFalse(validateNames(''));
  });

  it('should throw exception when "name" omitted', () => {
    assert.throws(validateNames, /Missing required "name" parameter/);
  });

});
