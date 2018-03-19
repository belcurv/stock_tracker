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

  it('should return false for "goog"', () => {
    assert.isFalse(validateTickers('goog'));
  });

  it('should return false when "ticker" is not a number', () => {
    assert.isFalse(validateTickers(666));
  });

  it('should throw exception when "ticker" omitted', () => {
    assert.throws(validateTickers, /Missing required "ticker" parameter/);
  });

});
