/* globals describe before beforeEach after it */

'use strict';

/* ================================= SETUP ================================= */

process.env.NODE_ENV = 'testing';

const db         = require('../../db/index');
const ObjectID   = require('mongodb').ObjectID;
const { assert } = require('chai');
const Portfolios = require('../../models/portfolios');

// dummy portfolio
const pfloOwner = '101010101010101010101010';
const pfloID1   = '111111111111111111111111';
const pfloID2   = '222222222222222222222222';

// dummy user
const dummy = {
  _id       : ObjectID(pfloOwner),
  username  : 'leroy',
  password  : 'testPassword',
  createdAt : Date.now(),
  updatedAt : Date.now()
};

// dummy portfolios
const dummyPflos = [
  {
    _id       : ObjectID(pfloID1),
    owner     : pfloOwner,
    name      : 'Portfolio 1',
    notes     : 'Dummy portfolio 1 notes',
    createdAt : Date.now(),
    updatedAt : Date.now()
  },
  {
    _id       : ObjectID(pfloID2),
    owner     : pfloOwner,
    name      : 'Portfolio 2',
    notes     : 'Dummy portfolio 2 notes',
    createdAt : Date.now(),
    updatedAt : Date.now()
  }
];


/* ================================= TESTS ================================= */

describe('Portfolios model', () => {

  before((done) => {
    db.connect((err) => {
      if (err) {
        console.log('Unable to connect to MongoDB\n', err);
        process.exit(1);
      } else {
        done();
      }
    });
  });
  
  before((done) => {
    const collection = db.get().collection('users');
    collection.insertOne(dummy, () => {
      done();
    });
  });

  after((done) => {
    const plfos_collection = db.get().collection('portfolios');
    const users_collection = db.get().collection('users');
    plfos_collection.drop(() => {
      users_collection.drop(() => {
        db.close(() => {
          done();
        });
      });
    });
  });

  
  describe('.getAll()', () => {

    before((done) => {
      const collection = db.get().collection('portfolios');
      collection.deleteMany(() => {
        collection.insertMany(dummyPflos, (err) => {
          if (err) { console.log('error inserting portfolios:, err'); }
          done();
        });
      });
    });

    it('should be a function', () => {
      assert.isFunction(Portfolios.getAll);
    });

    it('should return an empty array when no portfolios exist', async () => {
      const result = await Portfolios.getAll('098fg87sb6df987sdf8gk48f');
      assert.deepEqual(result, []);
    });
    
    it('should return an array containing a user\'s portfolios', async () => {
      const result = await Portfolios.getAll(pfloOwner);
      assert.lengthOf(result, 2);
      assert.deepInclude(result, dummyPflos[0]);
      assert.deepInclude(result, dummyPflos[1]);
    });
    
    it('should throw an error if `owner` is omitted', async () => {
      try {
        const result = await Portfolios.getAll();
        if (result) { throw new Error('this block should not execute'); }
      } catch (err) {
        assert.equal(err, 'missing or invalid owner `_id`');
      }
    });

    it('should throw an error if `owner` is not a String', async () => {
      try {
        const result = await Portfolios.getAll(666);
        if (result) { throw new Error('this block should not execute'); }
      } catch (err) {
        assert.equal(err, 'missing or invalid owner `_id`');
      }
    });

  });

  
  describe('.getOne()', () => {

    before((done) => {
      const collection = db.get().collection('portfolios');
      collection.deleteMany(() => {
        collection.insertMany(dummyPflos, (err) => {
          if (err) { console.log('error inserting portfolios:, err'); }
          done();
        });
      });
    });

    it('should be a function', () => {
      assert.isFunction(Portfolios.getOne);
    });

    it('should return null if portfolio "_id" not found', async () => {
      const pfloId = 'aaaaaaaaaaaaaaaaaaaaaaaa';
      const result = await Portfolios.getOne(pfloOwner, pfloId);
      assert.isNull(result);
    });

    it('should return null if portfolio "owner" not found', async () => {
      const pfloOwner = 'ffffffffffffffffffffffff';
      const result = await Portfolios.getOne(pfloOwner, pfloID1);
      assert.isNull(result);
    });

    it('should return a portfolio when passed valid params', async () => {
      const result = await Portfolios.getOne(pfloOwner, pfloID1);
      assert.deepEqual(result, dummyPflos[0]);
    });

    it('should throw an error if "_id" param is omitted', async () => {
      try {
        const result = await Portfolios.getOne(pfloOwner);
        if (result) { throw new Error('this block should not execute'); }
      } catch (err) {
        assert.equal(err, 'missing or invalid portfolio `_id`');
      }
    });

    it('should throw an error if "_id" is not a String', async () => {
      try {
        const result = await Portfolios.getOne(pfloOwner, 666);
        if (result) { throw new Error('this block should not execute'); }
      } catch (err) {
        assert.equal(err, 'missing or invalid portfolio `_id`');
      }
    });

    it('should throw an error if "owner" param is omitted', async () => {
      try {
        const result = await Portfolios.getOne(null, dummyPflos[0]._id);
        if (result) { throw new Error('this block should not execute'); }
      } catch (err) {
        assert.equal(err, 'missing or invalid owner `_id`');
      }
    });

    it('should throw an error if "owner" is not a String', async () => {
      try {
        const result = await Portfolios.getOne(666, dummyPflos[0]._id);
        if (result) { throw new Error('this block should not execute'); }
      } catch (err) {
        assert.equal(err, 'missing or invalid owner `_id`');
      }
    });

  });


  /**
   * Create a new portfolio
   * create = ({owner, name, notes}) => {
   * @param    {String}   owner   User _id
   * @param    {String}   name    Portfolio name
   * @param    {String}   notes   Notes about the portfolio
   * @returns  {Object}           Promise object + new portfolio
  */
  describe('.create()', () => {

    it('should be a function', () => {
      assert.isFunction(Portfolios.create);
    });

    it('should throw an error if "owner" param is omitted', async () => {
      try {
        const result = await Portfolios.create(null, 'P1');
        if (result) { throw new Error('this block should not execute'); }
      } catch (err) {
        assert.equal(err, 'TypeError: Cannot destructure property `owner` of \'undefined\' or \'null\'.');
      }
    });

    it('should throw an error if "owner" is not a String', async () => {
      try {
        const result = await Portfolios.create(666, 'P1');
        if (result) { throw new Error('this block should not execute'); }
      } catch (err) {
        assert.equal(err, 'missing or invalid portfolio `owner`');
      }
    });

    // if (!name || typeof name !== 'string') {
    //   return Promise.reject('missing or invalid portfolio `name`');
    // }

    // if (typeof notes !== 'string') {
    //   return Promise.reject('Portfolio `notes` must be a string');
    // }

  });

  
  /**
   * Update a portfolio
   * @param    {String}   owner   User _id
   * @param    {String}   _id     Portfolio _id
   * @param    {String}   name    Portfolio name
   * @param    {String}   notes   Notes about the portfolio
   * @returns  {Object}           Updated portfolio
  */
  describe('.update()', () => {

    it('should be a function', () => {
      assert.isFunction(Portfolios.update);
    });
  });


  /**
   * Delete a user's portfolio
   * @param    {String}   owner   User _id
   * @param    {String}   _id     Portfolio _id
  */
  describe('.deletePortfolio()', () => {

    it('should be a function', () => {
      assert.isFunction(Portfolios.deletePortfolio);
    });
  });


  /**
   * Check if a portfolio has a specific holding
   * @param    {String}   owner    User _id
   * @param    {String}   _id      Portfolio _id
   * @param    {String}   ticker   Holding's ticker symbol
   * @returns  {Boolean}           True if portfolio contains specified holding
  */
  describe('.hasHolding()', () => {

    it('should be a function', () => {
      assert.isFunction(Portfolios.hasHolding);
    });
  });


  /**
   * Add holding to portfolio
   * @param    {String}   owner    User _id
   * @param    {String}   _id      Portfolio _id
   * @param    {String}   ticker   Holding's ticker symbol
   * @param    {Number}   qty      Qty of shares owned
   * @returns  {Object}            Updated portfolio
  */
  describe('.addHolding()', () => {

    it('should be a function', () => {
      assert.isFunction(Portfolios.addHolding);
    });
  });


  /**
   * Update a holding in a user's portfolio
   * @param    {String}   owner    User _id
   * @param    {String}   pfloId   Portfolio _id
   * @param    {String}   hldgId   Holding _id
   * @param    {Number}   qty      Qty of shares owned
   * @returns  {Object}            Updated portfolio object
  */
  describe('.updateHolding()', () => {

    it('should be a function', () => {
      assert.isFunction(Portfolios.updateHolding);
    });
  });


  /**
   * Delete a holding from a user's portfolio
   * @param    {String}   owner    User _id
   * @param    {String}   pfloId   Portfolio _id
   * @param    {String}   hldgId   Holding _id
   * @returns  {Object}            Updated portfolio object
  */
  describe('.deleteHolding()', () => {

    it('should be a function', () => {
      assert.isFunction(Portfolios.deleteHolding);
    });
  });

});
