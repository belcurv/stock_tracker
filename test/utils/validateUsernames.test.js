/* globals describe it */

/* ================================= SETUP ================================= */

const { assert }        = require('chai');
const validateUsernames = require('../../utils/validateUsernames');


/* ================================= TESTS ================================= */

describe('Utility: validateUsernames', () => {

  it('should be a function', () => {
    assert.isFunction(validateUsernames);
  });

  it('should return true for "leroyjenkins"', () => {
    assert.isTrue(validateUsernames('leroyjenkins'));
  });

  it('should return true for "leroy.jenkins"', () => {
    assert.isTrue(validateUsernames('leroy.jenkins'));
  });

  it('should return true for "leroy jenkins"', () => {
    assert.isTrue(validateUsernames('leroy jenkins'));
  });

  it('should throw exception when "username" omitted', () => {
    assert.throws(validateUsernames, 'Missing required "username" parameter');
  });

  it('should throw exception when "username" is not a string', () => {
    const call = function () {
      validateUsernames(666);
    };
    assert.throws(call, 'Validation Error: Invalid "username": 666');
  });

  it('should throw exception when "username" is not a string', () => {
    const call = function () {
      validateUsernames(true);
    };
    assert.throws(call, 'Validation Error: Invalid "username": true');
  });

  it('should throw exception when "username" is just spaces', () => {
    const call = function () {
      validateUsernames('    ');
    };
    assert.throws(call, 'Validation Error: Invalid "username": ');
  });

  it('should throw exception when "username" < 3 characters', () => {
    const call = function () {
      validateUsernames('no');
    };
    assert.throws(call, 'Validation Error: Invalid "username": no');
  });

  it('should throw exception when "username" > 32 characters', () => {
    let longName = 'no_no_no_no_no_no_no_no_no_no_no_no';
    const call = function () {
      validateUsernames(longName);
    };
    assert.throws(call, `Validation Error: Invalid "username": ${longName}`);
  });

});
