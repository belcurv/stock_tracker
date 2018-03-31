/* globals describe it */

/* ================================= SETUP ================================= */

const assert           = require('chai').assert;
const validatePwHashes = require('../../utils/validatePwHashes');

const valids = [
  '$2a$10$AzJsMZRvYXvbNZ7MwSBMnu60h6gF1B3BlAGikg8xM7xiXJc1mDEsu',
  '$2a$10$zb2GmOvWh5gH.zBdqIcEjekBIQKS3qqEBEk9CY1ih.bdwQeXv8gWm'
];

const invalids = [
  '$2a$10$AzJsMZRvYXvbNZ7MwSBMnu60h6gF1B3BlAGikg8xM7xiXJc1mDEs',
  '$2aS10$zb2GmOvWh5gH.zBdqIcEjekBIQKS3qqEBEk9CY1ih.bdwQeXv8gWm'
];


/* ================================= TESTS ================================= */

describe('Utility: validatePwHashes', () => {

  it('should be a function', () => {
    assert.isFunction(validatePwHashes);
  });

  it('should return true for valid bcrypt hash', () => {
    assert.isTrue(validatePwHashes(valids[0]));
  });

  it('should return true for valid bcrypt hash', () => {
    assert.isTrue(validatePwHashes(valids[1]));
  });

  it('should throw exception when "pwHash" omitted', () => {
    assert.throws(validatePwHashes, 'Missing required "pwHash" parameter');
  });

  it('should throw exception for invalid bcrypt hash', () => {
    const call = function () {
      validatePwHashes(invalids[0]);
    };
    assert.throws(call, `Validation Error: Invalid "pwHash": ${invalids[0]}`);
  });

  it('should throw exception for invalid bcrypt hash', () => {
    const call = function () {
      validatePwHashes(invalids[1]);
    };
    assert.throws(call, `Validation Error: Invalid "pwHash": ${invalids[1]}`);
  });

});
