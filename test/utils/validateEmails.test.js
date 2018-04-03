/* global describe it */

/* ================================= SETUP ================================= */

const { assert }     = require('chai');
const validateEmails = require('../../utils/validateEmails');


/* ================================= TESTS ================================= */

describe('Utility: validateEmails', () => {

  it('should be a function', () => {
    assert.isFunction(validateEmails);
  });


  it('should return true from "name@example.com"', () => {
    assert.isTrue(validateEmails('name@example.com'));
  });


  it('should return true from "first-last@example.com"', () => {
    assert.isTrue(validateEmails('first-last@example.com'));
  });


  it('should return true from "first.last@example.com"', () => {
    assert.isTrue(validateEmails('first.last@example.com'));
  });


  it('should return true from "first.last@subdomain.example.com"', () => {
    assert.isTrue(validateEmails('first.last@subdomain.example.com'));
  });


  it('should throw an error when "email" is omitted', () => {
    assert.throws(validateEmails, 'Missing required "email" parameter');
  });


  it('should throw an error from "name@@example.com"', () => {
    const call = function() {
      validateEmails('name@@example.com');
    };
    assert.throws(call, 'Validation Error: Invalid "email": name@@example.com');
  });


  it('should throw an error from "name"', () => {
    const call = function() {
      validateEmails('name');
    };
    assert.throws(call, 'Validation Error: Invalid "email": name');
  });


  it('should throw an error from "name@example"', () => {
    const call = function() {
      validateEmails('name@example');
    };
    assert.throws(call, 'Validation Error: Invalid "email": name@example');
  });


  it('should throw an error from "@example.com"', () => {
    const call = function() {
      validateEmails('@example.com');
    };
    assert.throws(call, 'Validation Error: Invalid "email": @example.com');
  });


});
