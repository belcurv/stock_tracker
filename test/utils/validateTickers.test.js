/* globals describe it */

/* ================================= SETUP ================================= */

const { assert }      = require('chai');
const validateTickers = require('../../utils/validateTickers');


/* ================================= TESTS ================================= */

describe('Utility: validateNames', () => {

  it('should be a function', () => {
    assert.isFunction(validateTickers);
  });

  it('should return true for "GOOG"', () => {
    assert.isTrue(validateTickers('GOOG'));
  });

  it('should return true for "GE"', () => {
    assert.isTrue(validateTickers('GE'));
  });

  it('should throw exception when "ticker" omitted', () => {
    assert.throws(validateTickers, /Missing required "ticker" parameter/);
  });

  it('should throw exception for "goog"', () => {
    const call = function () {
      validateTickers('goog');
    };
    assert.throws(call, 'Validation Error: Invalid "ticker": goog');
  });

  it('should throw exception when "ticker" is not a number', () => {
    const call = function () {
      validateTickers(666);
    };
    assert.throws(call, 'Validation Error: Invalid "ticker": 666');
  });

});
