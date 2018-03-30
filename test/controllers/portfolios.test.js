/* global describe before beforeEach after it */

'use strict';

/* ================================= SETUP ================================= */

require('dotenv').config();

const mockery = require('mockery');
const expect  = require('chai').expect;
// const ObjectID   = require('mongodb').ObjectID;

// dummy ObjectID's (must be 24 characters long)
const pfloOwner1  = '101010101010101010101010';
const pfloOwner2  = '202020202020202020202020';
const pfloID1     = '111111111111111111111111';
const pfloID2     = '222222222222222222222222';
const pflo1hlngId = '4a4a4a4a4a4a4a4a4a4a4a4a';
const pflo2hlngId = '9b9b9b9b9b9b9b9b9b9b9b9b';

const dummyPflos = [
  {
    _id       : pfloID1,
    owner     : pfloOwner1,
    name      : 'Portfolio 1',
    notes     : 'Dummy portfolio 1 notes',
    holdings: [{
      ticker    : 'MSFT',
      _id       : pflo1hlngId,
      createdAt : Date.now(),
      updatedAt : Date.now(),
      qty       : 666
    }],
    createdAt : Date.now(),
    updatedAt : Date.now()
  },
  {
    _id       : pfloID2,
    owner     : pfloOwner2,
    name      : 'Portfolio 2',
    notes     : 'Dummy portfolio 2 notes',
    holdings: [{
      ticker    : 'AAPL',
      _id       : pflo2hlngId,
      createdAt : Date.now(),
      updatedAt : Date.now(),
      qty       : 1
    }],
    createdAt : Date.now(),
    updatedAt : Date.now()
  }
];


/* ========================== MOCK MODEL METHODS =========================== */

const getFakePflos = (owner, pfloId) => {
  if (pfloId) {
    return Promise.resolve(dummyPflos.filter(pflo => {
      return pflo.owner === owner && pflo._id === pfloId;
    })[0]);
  } else {
    return Promise.resolve(dummyPflos.filter(pflo => pflo.owner === owner ));
  }
};

const makeFakePflo = ({owner, name, notes}) => {
  return Promise.resolve({
    _id       : pfloID1,
    owner     : owner,
    name      : name,
    notes     : notes,
    holdings  : [],
    createdAt : Date.now(),
    updatedAt : Date.now()
  });
};

const updateFakePflo = ({ owner, pfloId }, updates) => {
  return getFakePflos(owner, pfloId)
    .then(pflo => Object.assign(pflo, updates, { updatedAt: Date.now() }));
};

const deleteFakePortfolio = () => {
  return Promise.resolve({
    result: { ok: 1, n: 1 },
    connection: {},
    deletedCount: 1
  });
};

/* ================================= TESTS ================================= */

describe('Portfolios controller', function() {

  let req = {};
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
    },

    mockery.enable({
      warnOnReplace      : false,
      warnOnUnregistered : false
    });

    mockery.registerMock('../models/portfolios', {
      getAll: (owner)           => getFakePflos(owner),
      getOne: (owner, pfloId)   => getFakePflos(owner, pfloId),
      create: (newPortfolio)    => makeFakePflo(newPortfolio),
      update: (filter, updates) => updateFakePflo(filter, updates),

      deletePortfolio: () => deleteFakePortfolio(),

      hasHolding: (owner, pfloId, ticker) => {
        /*
        {
          _id       : pfloID1,
          owner     : pfloOwner1,
          name      : 'Portfolio 1',
          notes     : 'Dummy portfolio 1 notes',
          holdings: [{
            ticker    : 'MSFT',
            _id       : pflo1hlngId,
            createdAt : Date.now(),
            updatedAt : Date.now(),
            qty       : 666
          }],
          createdAt : Date.now(),
          updatedAt : Date.now()
        }
        */
        return getFakePflos(owner, pfloId)
          .then(pflo => {
            return pflo.holdings.reduce((acc, hldg) => {
              acc = hldg.ticker === ticker;
            }, false);
          });
      },
      addHolding: ({ owner, pfloId }, { ticker, qty }) => {
        return true;
      },
      updateHolding: ({ owner, pfloId, hldgId }, qty) => {
        return true;
      },
      deleteHolding: ({ owner, pfloId, hldgId }) => {
        return true;
      }
    });

    this.controller = require('../../controllers/portfolios');

  });


  beforeEach(function() {
    req = {};
  });


  after(function() {
    mockery.deregisterAll();
    mockery.disable();
  });


  it('.getAll() should return array of user\'s portfolios', async function() {
    req.user = { _id : pfloOwner1 };
    const { resData } = await this.controller.getAll(req, res);
    
    expect(resData.status).to.eql(200);
    expect(resData.json).to.be.a('array').of.length(1);
    expect(resData.json[0].owner).to.eql(pfloOwner1);
  });


  it('.getOne() should return single user portfolio', async function() {
    req.user   = { _id : pfloOwner1 };
    req.params = {  id : pfloID1 };
    const { resData } = await this.controller.getOne(req, res);
    
    expect(resData.status).to.eql(200);
    expect(resData.json.owner).to.eql(pfloOwner1);
  });
  
  
  it('.create() should return a newly created portfolio', async function() {
    req.user = { _id : pfloOwner1 };
    req.body = { name: 'test portfolio', notes: 'test notes' };
    const { resData } = await this.controller.create(req, res);
    
    expect(resData.status).to.eql(200);
    expect(resData.json.owner).to.eql(pfloOwner1);
    expect(resData.json.name).to.eql('test portfolio');
    expect(resData.json.notes).to.eql('test notes');
  });


  it('.update() should return an updated portfolio', async function() {
    req.user   = { _id : pfloOwner1 };
    req.params = {  id : pfloID1 };
    req.body   = { name: 'updated name', notes: 'updated notes' };
    const { resData } = await this.controller.update(req, res);

    expect(resData.status).to.eql(200);
    expect(resData.json._id).to.eql(pfloID1);
    expect(resData.json.name).to.eql('updated name');
    expect(resData.json.notes).to.eql('updated notes');
  });


  it('.deletePortfolio() should return a success message', async function() {
    req.user   = { _id : pfloOwner1 };
    req.params = {  id : pfloID1 };
    const { resData } = await this.controller.deletePortfolio(req, res);

    expect(resData.status).to.eql(200);
    expect(resData.json.result).to.deep.eql({ ok: 1, n: 1 });
  });


  it('.addHolding() should return portfolio w/new holding', async function() {
    
  });

});
