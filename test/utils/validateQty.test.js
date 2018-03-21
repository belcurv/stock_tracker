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

  it('should throw exception when "qty" omitted', () => {
    assert.throws(validateQty, /Missing required "qty" parameter/);
  });

  it('should throw exception when "qty" is a negative number', () => {
    const call = function () {
      validateQty(-2222);
    };
    assert.throws(call, /Validation Error: Invalid "qty": -2222/);
  });

  it('should throw exception when "qty" is not a number', () => {
    const call = function () {
      validateQty('666');
    };
    assert.throws(call, /Validation Error: Invalid "qty": 666/);
  });

});
