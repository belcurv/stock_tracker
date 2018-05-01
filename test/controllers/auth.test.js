/* global describe it before beforeEach after */

'use strict';

/* ================================= SETUP ================================= */

require('dotenv').config();

const mockery = require('mockery');
const expect  = require('chai').expect;

let password;


/* ============================ UTILITY METHODS ============================ */

const makeMockUser = (email, pwHash) => {
  if (!password) { password = pwHash; }
  return Promise.resolve({
    _id       : '101010101010101010101010',
    email     : email,
    password  : password,
    createdAt : Date.now(),
    updatedAt : Date.now()
  });
};


/* ================================= TESTS ================================= */

describe('Authentication controller', function() {

  let req;
  let res;


  before(function() {

    res = {
      resData : {
        status : 0,
        json   : ''
      },
      status(status) {
        res.resData.status = status;
        return this;
      },
      json(json) {
        res.resData.json = json;
        return this;
      }
    };

    mockery.enable({
      warnOnReplace      : false,
      warnOnUnregistered : false
    });

    mockery.registerMock('../models/users', {
      exists      : (email) => email === 'ok@yay.io',
      create      : ({ email, pwHash }) => makeMockUser(email, pwHash),
      findByEmail : (email) => email === 'ok@yay.io' ? makeMockUser(email) : null
    });

    this.controller = require('../../controllers/auth');

  });


  beforeEach(function() {
    req = {};
  });


  after(function() {
    mockery.deregisterAll();
    mockery.disable();
  });


  it('.register() should return valid JWT on success', async function() {
    req.body = {
      email     : 'im.valid@yay.io',
      password1 : 'testpassword',
      password2 : 'testpassword'
    };
    const { resData } = await this.controller.register(req, res);

    expect(resData.status).to.eql(200);
    expect(resData.json.token.split('.').length).to.eql(3);
  });


  it('.register() should return error if user exists', async function() {
    req.body = {
      email     : 'ok@yay.io',
      password1 : 'testpassword',
      password2 : 'testpassword'
    };
    const { resData } = await this.controller.register(req, res);

    expect(resData.status).to.eql(500);
    expect(resData.json.message).to.eql('email already taken');
  });


  it('.register() should return error if email omitted', async function() {
    req.body = {
      password1 : 'testpassword',
      password2 : 'testpassword'
    };
    const { resData } = await this.controller.register(req, res);

    expect(resData.status).to.eql(400);
    expect(resData.json.message).to.eql('Missing required fields');
  });


  it('.register() should return error if password omitted', async function() {
    req.body = {
      email     : 'ok@yay.io',
      password2 : 'testpassword'
    };
    const { resData } = await this.controller.register(req, res);

    expect(resData.status).to.eql(400);
    expect(resData.json.message).to.eql('Missing required fields');
  });


  it('.register() should return error if passwords !match', async function() {
    req.body = {
      email     : 'ok@yay.io',
      password1 : 'testpassword',
      password2 : 'doesntmatch'
    };
    const { resData } = await this.controller.register(req, res);

    expect(resData.status).to.eql(400);
    expect(resData.json.message).to.eql('Passwords must match');
  });


  it('.login() should return valid JWT on success', async function() {
    req.body = {
      email    : 'ok@yay.io',
      password : 'testpassword'
    };
    const { resData } = await this.controller.login(req, res);

    expect(resData.status).to.eql(200);
    expect(resData.json.token.split('.').length).to.eql(3);
  });


  it('.login() should return error if email omitted', async function() {
    req.body = {
      password : 'testpassword'
    };
    const { resData } = await this.controller.login(req, res);

    expect(resData.status).to.eql(500);
    expect(resData.json.message).to.eql('Missing required fields');
  });


  it('.login() should return error if password omitted', async function() {
    req.body = {
      email : 'ok@yay.io',
    };
    const { resData } = await this.controller.login(req, res);

    expect(resData.status).to.eql(500);
    expect(resData.json.message).to.eql('Missing required fields');
  });


  it('.login() should return error if user not found', async function() {
    req.body = {
      email    : 'null@example.com',
      password : 'testpassword'
    };
    const { resData } = await this.controller.login(req, res);

    expect(resData.status).to.eql(404);
    expect(resData.json.message).to.eql('No user with that email');
  });


  it('.login() should return error from invalid password', async function() {
    req.body = {
      email    : 'ok@yay.io',
      password : 'invalidpass'
    };
    const { resData } = await this.controller.login(req, res);

    expect(resData.status).to.eql(500);
    expect(resData.json.message).to.eql('Invalid login credentials');
  });

});
