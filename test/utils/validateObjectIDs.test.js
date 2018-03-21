/* globals describe it */

/* ================================= SETUP ================================= */

const { assert }        = require('chai');
const validateObjectIds = require('../../utils/validateObjectIds');


/* ================================= TESTS ================================= */

describe('Utility: validateObjectIDs', () => {

  it('should be a function', () => {
    assert.isFunction(validateObjectIds);
  });

  it('should return true for valid ObjectIDs', () => {
    assert.isTrue(validateObjectIds('0123abcdef456789acdef012'));
  });

  it('should throw exception when "_id" omitted', () => {
    const call = function () {
      validateObjectIds(undefined, 'ObjectID');
    };
    assert.throws(call, 'Missing required "ObjectID" parameter');
  });

  it('should throw exception for invalid ObjectIDs', () => {
    const call = function () {
      validateObjectIds('0123abcdef456789ghghg012', 'ObjectID');
    };
    assert.throws(call, 'Validation Error: Invalid "ObjectID": 0123abcdef456789ghghg012');
  });

  it('should throw exception for invalid ObjectIDs', () => {
    const call = function () {
      validateObjectIds(666, 'ObjectID');
    };
    assert.throws(call, 'Validation Error: Invalid "ObjectID": 666');
  });

});
