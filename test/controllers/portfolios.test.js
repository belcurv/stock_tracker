/* global describe before beforeEach after it */

'use strict';

/* ================================= SETUP ================================= */

require('dotenv').config();

const mockery = require('mockery');
const expect  = require('chai').expect;

const pfloOwner1  = '101010101010101010101010';
const pfloOwner2  = '202020202020202020202020';
const pfloID1     = '111111111111111111111111';
const pfloID2     = '222222222222222222222222';
const pflo1hlngId = '4a4a4a4a4a4a4a4a4a4a4a4a';
const pflo2hlngId = '9b9b9b9b9b9b9b9b9b9b9b9b';

const dummyPflos = [
  {
    _id      : pfloID1,
    owner    : pfloOwner1,
    name     : 'Portfolio 1',
    notes    : 'Dummy portfolio 1 notes',
    holdings : [{
      ticker : 'MSFT',
      _id    : pflo1hlngId,
      qty    : 666
    }]
  },
  {
    _id      : pfloID2,
    owner    : pfloOwner2,
    name     : 'Portfolio 2',
    notes    : 'Dummy portfolio 2 notes',
    holdings : [{
      ticker : 'AAPL',
      _id    : pflo2hlngId,
      qty    : 1
    }]
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

const updateFakePflo = ({ owner, pfloId, hldgId }, updates) => {
  return getFakePflos(owner, pfloId)
    .then(pflo => {
      if (updates.addHldg) {
        pflo.holdings.push(updates.addHldg);
        return pflo;
      } else if (updates.updateHldg) {
        pflo.holdings.forEach(hldg => {
          if (hldg._id === hldgId) { hldg.qty = updates.updateHldg; }
        });
        return pflo;
      } else if (updates.delete) {
        for (let i = 0; i < pflo.holdings.length; i += 1) {
          if (pflo.holdings[i]._id === hldgId) {
            pflo.holdings.splice(i, 1);
          }
        }
        return pflo;
      } else {
        return Object.assign(pflo, updates, { updatedAt : Date.now() });
      }
    });
};

const deleteFakePortfolio = () => {
  return Promise.resolve({
    result       : { ok : 1, n : 1 },
    connection   : {},
    deletedCount : 1
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
      getAll          : (owner) => getFakePflos(owner),
      getOne          : (owner, pfloId) => getFakePflos(owner, pfloId),
      create          : (newPortfolio) => makeFakePflo(newPortfolio),
      update          : (fltr, updates) => updateFakePflo(fltr, updates),
      deletePortfolio : () => deleteFakePortfolio(),
      addHolding      : (fltr, hldg) => updateFakePflo(fltr, { addHldg : hldg }),
      updateHolding   : (fltr, qty) => updateFakePflo(fltr, { updateHldg : qty }),
      deleteHolding   : (fltr) => updateFakePflo(fltr, { delete : true }),
      hasHolding      : (owner, pflo, ticker) => owner && pflo && ticker === 'MSFT'
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
    expect(resData.json).to.be.a('array');
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
    req.body = { name : 'test portfolio', notes : 'test notes' };
    const { resData } = await this.controller.create(req, res);

    expect(resData.status).to.eql(200);
    expect(resData.json.owner).to.eql(pfloOwner1);
    expect(resData.json.name).to.eql('test portfolio');
    expect(resData.json.notes).to.eql('test notes');
  });


  it('.update() should return an updated portfolio', async function() {
    req.user   = { _id : pfloOwner1 };
    req.params = {  id : pfloID1 };
    req.body   = { name : 'updated name', notes : 'updated notes' };
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
    expect(resData.json.result).to.deep.eql({ ok : 1, n : 1 });
  });


  it('.addHolding() should return portfolio w/new holding', async function() {
    req.user   = { _id : pfloOwner1 };
    req.params = {  id : pfloID1 };
    req.body   = { ticker : 'ZZZZ', qty : 666 };
    const { resData } = await this.controller.addHolding(req, res);

    expect(resData.status).to.eql(200);
    expect(resData.json.holdings).to.deep.include({ticker : 'ZZZZ', qty : 666});
  });


  it('.addHolding() should error if portfolio has holding', async function() {
    req.user   = { _id : pfloOwner1 };
    req.params = {  id : pfloID1 };
    req.body   = { ticker : 'MSFT', qty : 666 };
    const { resData } = await this.controller.addHolding(req, res);

    expect(resData.status).to.eql(403);
    expect(resData.json.message).to.eql(
      'Holding MSFT already exists in portfolio.'
    );
  });


  it('.updateHolding() should return updated portfolio', async function() {
    req.user   = { _id : pfloOwner1 };
    req.params = { pfloId : pfloID1, hldgId : pflo1hlngId };
    req.body   = { qty : 999999 };
    const { resData } = await this.controller.updateHolding(req, res);

    expect(resData.status).to.eql(200);
    expect(resData.json.holdings).to.deep.include({
      ticker : 'MSFT',
      _id    : pflo1hlngId,
      qty    : 999999
    });
  });


  it('.deleteHolding() should return updated portfolio', async function() {
    req.user   = { _id : pfloOwner1 };
    req.params = { pfloId : pfloID1, hldgId : pflo1hlngId };
    const { resData } = await this.controller.deleteHolding(req, res);

    expect(resData.status).to.eql(200);
    expect(resData.json.holdings).to.not.deep.include({
      ticker : 'MSFT',
      _id    : pflo1hlngId,
      qty    : 999999
    });
  });

});
