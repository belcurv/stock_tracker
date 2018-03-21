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

  it('should throw exception when "name" omitted', () => {
    assert.throws(validateNames, /Missing required "name" parameter/);
  });

  it('should throw exception for non-String params', () => {
    const call = function () {
      validateNames(666);
    };
    assert.throws(call, 'Validation Error: Invalid "name": 666');
  });

  it('should throw exception for non-String params', () => {
    const call = function () {
      validateNames(true);
    };
    assert.throws(call, 'Validation Error: Invalid "name": true');
  });

  it('should throw exception for empty strings', () => {
    const call = function () {
      validateNames('');
    };
    assert.throws(call, 'Validation Error: Invalid "name": ');
  });

});
