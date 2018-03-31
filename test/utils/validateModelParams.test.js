/* globals describe beforeEach it */

/* ================================= SETUP ================================= */

const { assert } = require('chai');
const Validator  = require('../../utils/validateModelParams');

function checkString(val) {
  if (typeof val !== 'string') {
    throw new Error(`Invalid "string": ${val}`);
  }
  return true;
}

function checkNumber(val) {
  if (typeof val !== 'number') {
    throw new Error(`Invalid "number": ${val}`);
  }
  return true;
}

const testSchema = {
  string : checkString,
  number : checkNumber
};


/* ================================= TESTS ================================= */

describe('Utility: validateModelParams', () => {

  let validator;

  beforeEach(() => {
    validator = new Validator(testSchema);
  });
  

  it('should be a function', () => {
    assert.isFunction(Validator);
  });

  it('should be a constructor', () => {
    assert.instanceOf(validator, Validator);
  });

  it('instances should have default "schema" property if not passed', () => {
    const defaultValidator = new Validator();
    assert.isObject(defaultValidator.schema);
    assert.isNotEmpty(defaultValidator.schema);
  });

  it('instances should have custom "schema" property if passed', () => {
    assert.isObject(validator.schema);
    assert.hasAllKeys(validator.schema, ['string', 'number']);
  });

  it('instances should have a "check" method', () => {
    assert.isFunction(validator.check);
  });

  it('instances should return true for valid string "yay"', () => {
    assert.isTrue(validator.check({ string: 'yay' }));
  });

  it('instances should return true for valid number 666', () => {
    assert.isTrue(validator.check({ number: 666 }));
  });

  it('instances should throw exception for invalid string', () => {
    const call = function() {
      validator.check({ string: 666 });
    };
    assert.throws(call, 'Invalid "string": 666');
  });

  it('instances should throw exception for invalid number', () => {
    const call = function() {
      validator.check({ number: 'bananas' });
    };
    assert.throws(call, 'Invalid "number": bananas');
  });

});
