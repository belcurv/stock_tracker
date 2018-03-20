/* globals describe it */

/* ================================= SETUP ================================= */

const { assert }  = require('chai');
const validateQty = require('../../utils/validateQty');


/* ================================= TESTS ================================= */

describe('Utility: validateQty', () => {

  it('should be a function', () => {
    assert.isFunction(validateQty);
  });

  it('should return true when "qty" is a positive number', () => {
    assert.isTrue(validateQty(1111));
  });

  it('should return false when "qty" is a negative number', () => {
    assert.isFalse(validateQty(-2222));
  });

  it('should return false when "qty" is not a number', () => {
    assert.isFalse(validateQty('666'));
  });

  it('should throw exception when "qty" omitted', () => {
    assert.throws(validateQty, /Missing required "qty" parameter/);
  });

});
