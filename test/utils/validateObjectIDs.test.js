/* globals describe it */

/* ================================= SETUP ================================= */

const { assert }        = require('chai');
const validateObjectIds = require('../../utils/validateObjectIds');


/* ================================= TESTS ================================= */

describe('Utility: validateNames', () => {

  it('should be a function', () => {
    assert.isFunction(validateObjectIds);
  });

  it('should return true for valid ObjectIDs', () => {
    assert.isTrue(validateObjectIds('0123abcdef456789acdef012'));
  });

  it('should return false for invalid ObjectIDs', () => {
    assert.isFalse(validateObjectIds('0123abcdef456789ghghg012'));
  });

  it('should return false for invalid ObjectIDs', () => {
    assert.isFalse(validateObjectIds(666));
  });

  it('should throw exception when "_id" omitted', () => {
    assert.throws(validateObjectIds, /Missing required "_id" parameter/);
  });

});
