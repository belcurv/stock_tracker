/* global describe it before after */

'use strict';

/* ================================= SETUP ================================= */

require('dotenv').config();

const mockery = require('mockery');
const chai    = require('chai');
const expect  = chai.expect;

let password;

const makeMockUser = (username, pwHash) => {
  if (!password) { password = pwHash; }
  return Promise.resolve({
    _id       : '101010101010101010101010',
    password  : password,
    username  : username,
    createdAt : Date.now(),
    updatedAt : Date.now()
  });
};


/* ================================= TESTS ================================= */

describe('Authentication controller', function() {

  let req = {};
  let res;


  before(function() {

    res = {
      resData : {
        status : 0,
        json   : ''
      },
      status: function(status) {
        res.resData.status = status;
        return this;
      },
      json: function(json) {
        res.resData.json = json;
        return this;
      }
    };

    mockery.enable({
      warnOnReplace: false,
      warnOnUnregistered: false
    });

    mockery.registerMock('../models/users', {
      usernameExists: (username) => username === 'biff' ? true : false,
      createUser: ({username, pwHash}) => makeMockUser(username, pwHash),
      getUser: (username) => username === 'biff' ? makeMockUser(username) : null
    });

    this.controller = require('../../controllers/auth');

  });


  after(function() {
    mockery.deregisterAll();
    mockery.disable();
  });


  it('.register() should return valid JWT on success', async function() {
    req.body = {
      username  : 'biff2',
      password1 : 'testpassword',
      password2 : 'testpassword'
    };
    const { resData } = await this.controller.register(req, res);

    expect(resData.status).to.eql(200);
    expect(resData.json.split('.').length).to.eql(3);
  });


  it('.register() should return error if username taken', async function() {
    req.body = {
      username  : 'biff',
      password1 : 'testpassword',
      password2 : 'testpassword'
    };
    const { resData } = await this.controller.register(req, res);

    expect(resData.status).to.eql(500);
    expect(resData.json.message).to.eql('Username already taken');
  });


  it('.register() should return error if username omitted', async function() {
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
      username  : 'biff2',
      password2 : 'testpassword'
    };
    const { resData } = await this.controller.register(req, res);

    expect(resData.status).to.eql(400);
    expect(resData.json.message).to.eql('Missing required fields');
  });


  it('.register() should return error if passwords !match', async function() {
    req.body = {
      username  : 'biff2',
      password1 : 'testpassword',
      password2 : 'doesntmatch'
    };
    const { resData } = await this.controller.register(req, res);

    expect(resData.status).to.eql(400);
    expect(resData.json.message).to.eql('Passwords must match');
  });


  it('.login() should return valid JWT on success', async function() {
    req.body = {
      username : 'biff',
      password : 'testpassword'
    };
    const { resData } = await this.controller.login(req, res);

    expect(resData.status).to.eql(200);
    expect(resData.json.split('.').length).to.eql(3);
  });


  it('.login() should return error if username omitted', async function() {
    req.body = {
      password : 'testpassword'
    };
    const { resData } = await this.controller.login(req, res);

    expect(resData.status).to.eql(500);
    expect(resData.json.message).to.eql('Missing required fields');
  });
  

  it('.login() should return error if password omitted', async function() {
    req.body = {
      username : 'biff'
    };
    const { resData } = await this.controller.login(req, res);

    expect(resData.status).to.eql(500);
    expect(resData.json.message).to.eql('Missing required fields');
  });


  it('.login() should return error if user not found', async function() {
    req.body = {
      username : 'biffbraff',
      password : 'testpassword'
    };
    const { resData } = await this.controller.login(req, res);

    expect(resData.status).to.eql(404);
    expect(resData.json.message).to.eql('No user with that username');
  });


  it('.login() should return error from invalid password', async function() {
    req.body = {
      username : 'biff',
      password : 'invalidpass'
    };
    const { resData } = await this.controller.login(req, res);

    expect(resData.status).to.eql(500);
    expect(resData.json.message).to.eql('Invalid login credentials');
  });

});
