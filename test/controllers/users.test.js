/* global describe it before beforeEach after */

'use strict';

/* ================================= SETUP ================================= */

require('dotenv').config();

const mockery = require('mockery');
const expect  = require('chai').expect;


/* ============================ UTILITY METHODS ============================ */

const makeMockUser = (_id) => {
  return Promise.resolve({
    _id       : _id,
    email     : 'email@example.com',
    createdAt : Date.now(),
    updatedAt : Date.now()
  });
};


/* ================================= TESTS ================================= */

describe('Users controller', function() {

  const testId = '101010101010101010101010';

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
      findById  : (id) => id === testId ? makeMockUser(id) : null,
      deleteOne : (id) => Promise.resolve({deletedCount : id === testId ? 1 : 0})
    });

    this.controller = require('../../controllers/users');

  });

  beforeEach(function() {
    req = {};
  });

  after(function() {
    mockery.deregisterAll();
    mockery.disable();
  });


  it('.getOne() should return single user object', async function() {
    req.user   = { _id : testId };
    req.params = { id : testId };
    const { resData } = await this.controller.getOne(req, res);
    expect(resData.status).to.eql(200);
    expect(resData.json._id).to.eql(testId);
  });


  it('.getOne() should return error if user._id missing', async function() {
    req.user   = {};
    req.params = { id : testId };
    const { resData } = await this.controller.getOne(req, res);
    expect(resData.status).to.eql(400);
    expect(resData.json.message).to.eql('Missing or invalid user params');
  });


  it('.getOne() should return error if params.id missing', async function() {
    req.user   = { _id : testId };
    req.params = {};
    const { resData } = await this.controller.getOne(req, res);
    expect(resData.status).to.eql(400);
    expect(resData.json.message).to.eql('Missing or invalid user params');
  });


  it('.getOne() should return error if user.id != params.id', async function() {
    req.user   = { _id : testId };
    req.params = { id : '202020202020202020202020' };
    const { resData } = await this.controller.getOne(req, res);
    expect(resData.status).to.eql(400);
    expect(resData.json.message).to.eql('Missing or invalid user params');
  });


  it('.deleteUser() should return success message on delete', async function() {
    req.user   = { _id : testId };
    req.params = { id : testId };
    const { resData } = await this.controller.deleteUser(req, res);
    expect(resData.status).to.eql(200);
    expect(resData.json.message).to.eql('User deleted');
  });


  it('.deleteUser() should return 404 message on not found', async function() {
    req.user   = { _id : '202020202020202020202020' };
    req.params = { id : '202020202020202020202020' };
    const { resData } = await this.controller.deleteUser(req, res);
    expect(resData.status).to.eql(404);
    expect(resData.json.message).to.eql('User not found');
  });


  it('.deleteUser() should return error if user._id missing', async function() {
    req.user   = {};
    req.params = { id : testId };
    const { resData } = await this.controller.deleteUser(req, res);
    expect(resData.status).to.eql(400);
    expect(resData.json.message).to.eql('Missing or invalid user params');
  });


  it('.deleteUser() should return error if params.id missing', async function() {
    req.user   = { _id : testId };
    req.params = {};
    const { resData } = await this.controller.deleteUser(req, res);
    expect(resData.status).to.eql(400);
    expect(resData.json.message).to.eql('Missing or invalid user params');
  });


  it('.deleteUser() should return error if user.id != params.id', async function() {
    req.user   = { _id : testId };
    req.params = { id : '202020202020202020202020' };
    const { resData } = await this.controller.deleteUser(req, res);
    expect(resData.status).to.eql(400);
    expect(resData.json.message).to.eql('Missing or invalid user params');
  });

});