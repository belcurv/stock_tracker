/* globals describe before beforeEach after it */

'use strict';

/* ================================= SETUP ================================= */

process.env.NODE_ENV = 'testing';

const db         = require('../../db/index');
const ObjectID   = require('mongodb').ObjectID;
const { assert } = require('chai');
const Portfolios = require('../../models/portfolios');

// dummy ObjectID's (must be 24 characters long)
const pfloOwner  = '101010101010101010101010';
const pfloID1    = '111111111111111111111111';
const pfloID2    = '222222222222222222222222';

// dummy portfolios
const dummyPflos = [
  {
    _id       : ObjectID(pfloID1),
    owner     : pfloOwner,
    name      : 'Portfolio 1',
    notes     : 'Dummy portfolio 1 notes',
    holdings: [{
      ticker    : 'MSFT',
      _id       : ObjectID('4a4a4a4a4a4a4a4a4a4a4a4a'),
      createdAt : Date.now(),
      updatedAt : Date.now(),
      qty       : 666
    }],
    createdAt : Date.now(),
    updatedAt : Date.now()
  },
  {
    _id       : ObjectID(pfloID2),
    owner     : pfloOwner,
    name      : 'Portfolio 2',
    notes     : 'Dummy portfolio 2 notes',
    holdings: [{
      ticker    : 'AAPL',
      _id       : ObjectID('9b9b9b9b9b9b9b9b9b9b9b9b'),
      createdAt : Date.now(),
      updatedAt : Date.now(),
      qty       : 1
    }],
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

  after((done) => {
    const plfos_collection = db.get().collection('portfolios');
    plfos_collection.deleteMany(() => {
      db.close(() => {
        done();
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
  
  
  describe('.create()', () => {

    it('should be a function', () => {
      assert.isFunction(Portfolios.create);
    });

    it('should return an object on successful save', async () => {
      const doc    = { owner: pfloOwner, name: 'pName', notes: 'pNotes' };
      const result = await Portfolios.create(doc);
      assert.isObject(result);
    });

    it('should return an object with all keys on success', async () => {
      const doc    = { owner: pfloOwner, name: 'pName', notes: 'pNotes' };
      const result = await Portfolios.create(doc);
      const pKeys  = [
        '_id', 'owner', 'holdings', 'name', 'notes', 'createdAt', 'updatedAt'
      ];
      assert.hasAllKeys(result, pKeys);
    });

    it('saved portfolio\'s "owner" should match input', async () => {
      const doc    = { owner: pfloOwner, name: 'pName', notes: 'pNotes' };
      const result = await Portfolios.create(doc);
      assert.equal(result.owner, pfloOwner);
    });

    it('saved portfolio\'s "name" should match input', async () => {
      const doc    = { owner: pfloOwner, name: 'pName', notes: 'pNotes' };
      const result = await Portfolios.create(doc);
      assert.equal(result.name, 'pName');
    });

    it('saved portfolio\'s "notes" should match input', async () => {
      const doc    = { owner: pfloOwner, name: 'pName', notes: 'pNotes' };
      const result = await Portfolios.create(doc);
      assert.equal(result.notes, 'pNotes');
    });

    it('saved portfolio\'s "holdings" should be empty Array', async () => {
      const doc    = { owner: pfloOwner, name: 'pName', notes: 'pNotes' };
      const result = await Portfolios.create(doc);
      assert.deepEqual(result.holdings, []);
    });

    it('saved portfolio\'s timestamps should be finite numbers', async () => {
      const doc    = { owner: pfloOwner, name: 'pName', notes: 'pNotes' };
      const result = await Portfolios.create(doc);
      assert.isFinite(result.createdAt);
      assert.isFinite(result.updatedAt);
    });

    it('should throw an error if "owner" param is omitted', async () => {
      try {
        const badDoc = { owner: null, name: 'P1' };
        const result = await Portfolios.create(badDoc);
        if (result) { throw new Error('this block should not execute'); }
      } catch (err) {
        assert.equal(err, 'missing or invalid portfolio `owner`');
      }
    });

    it('should throw an error if "owner" is not a String', async () => {
      try {
        const badDoc = { owner: 666, name: 'P1' };
        const result = await Portfolios.create(badDoc);
        if (result) { throw new Error('this block should not execute'); }
      } catch (err) {
        assert.equal(err, 'missing or invalid portfolio `owner`');
      }
    });

    it('should throw an error if "name" param is omitted', async () => {
      try {
        const badDoc = { owner: pfloOwner };
        const result = await Portfolios.create(badDoc);
        if (result) { throw new Error('this block should not execute'); }
      } catch (err) {
        assert.equal(err, 'missing or invalid portfolio `name`');
      }
    });

    it('should throw an error if "name" is not a String', async () => {
      try {
        const badDoc = { owner: pfloOwner, name: 666 };
        const result = await Portfolios.create(badDoc);
        if (result) { throw new Error('this block should not execute'); }
      } catch (err) {
        assert.equal(err, 'missing or invalid portfolio `name`');
      }
    });

    it('should throw an error if "notes" is not a String', async () => {
      try {
        const badDoc = { owner: pfloOwner, name: '666', notes: 666 };
        const result = await Portfolios.create(badDoc);
        if (result) { throw new Error('this block should not execute'); }
      } catch (err) {
        assert.equal(err, 'Portfolio `notes` must be a string');
      }
    });

  });

  
  describe('.update()', () => {

    // insert a portfolio so we have one to update
    before((done) => {
      const collection = db.get().collection('portfolios');
      collection.deleteMany(() => {
        collection.insertOne(dummyPflos[0], (err) => {
          if (err) { console.log('error inserting portfolios:, err'); }
          done();
        });
      });
    });

    it('should be a function', () => {
      assert.isFunction(Portfolios.update);
    });

    it('should return an object on update success', async () => {
      const target = { owner : pfloOwner, _id   : pfloID1 };
      const update = { name  : 'testIsObj', notes : 'testIsObj' };
      const result = await Portfolios.update(target, update);
      assert.isObject(result);
    });

    it('updated portfolio should have all keys', async () => {
      const target = { owner : pfloOwner, _id   : pfloID1 };
      const update = { name  : 'testHasKeys', notes : 'testHasKeys' };
      const result = await Portfolios.update(target, update);
      const pKeys  = [
        '_id', 'owner', 'holdings', 'name', 'notes', 'createdAt', 'updatedAt'
      ];
      assert.hasAllKeys(result, pKeys);
    });

    it('updated portfolio\'s "name" should match input', async () => {
      const target = { owner : pfloOwner, _id   : pfloID1 };
      const update = { name  : 'testHasKeys', notes : 'testHasKeys' };
      const result = await Portfolios.update(target, update);
      assert.equal(result.name, update.name);
    });

    it('updated portfolio\'s "notes" should match input', async () => {
      const target = { owner : pfloOwner, _id   : pfloID1 };
      const update = { name  : 'testHasKeys', notes : 'testHasKeys' };
      const result = await Portfolios.update(target, update);
      assert.equal(result.notes, update.notes);
    });

    it('updated portfolio\'s timestamps should NOT match', async () => {
      const target = { owner : pfloOwner, _id   : pfloID1 };
      const update = { name  : 'testHasKeys', notes : 'testHasKeys' };
      const result = await Portfolios.update(target, update);
      assert.isTrue(result.createdAt < result.updatedAt);
    });

    it('should throw an error if "owner" param is omitted', async () => {
      try {
        const badTarget = { owner: null, _id: pfloID1 };
        const update    = { name: 'testHasKeys', notes: 'testHasKeys' };
        const result    = await Portfolios.update(badTarget, update);
        if (result) { throw new Error('this block should not execute'); }
      } catch (err) {
        assert.equal(err, 'missing or invalid portfolio `owner`');
      }
    });

    it('should throw an error if "owner" is not a String', async () => {
      try {
        const badTarget = { owner: 666, _id: pfloID1 };
        const update    = { name: 'testHasKeys', notes: 'testHasKeys' };
        const result    = await Portfolios.update(badTarget, update);
        if (result) { throw new Error('this block should not execute'); }
      } catch (err) {
        assert.equal(err, 'missing or invalid portfolio `owner`');
      }
    });

    it('should throw an error if "_id" param is omitted', async () => {
      try {
        const badDoc = { owner: pfloOwner, _id: null };
        const update = { name: 'testHasKeys', notes: 'testHasKeys' };
        const result = await Portfolios.update(badDoc, update);
        if (result) { throw new Error('this block should not execute'); }
      } catch (err) {
        assert.equal(err, 'missing or invalid portfolio `_id`');
      }
    });

    it('should throw an error if "_id" is not a String', async () => {
      try {
        const badDoc = { owner: pfloOwner, _id: 666 };
        const update = { name: 'testHasKeys', notes: 'testHasKeys' };
        const result = await Portfolios.update(badDoc, update);
        if (result) { throw new Error('this block should not execute'); }
      } catch (err) {
        assert.equal(err, 'missing or invalid portfolio `_id`');
      }
    });

    it('should throw an error when given invalid updates', async () => {
      try {
        const badDoc = { owner: pfloOwner, _id: pfloID1 };
        const update = { name: 666, notes: 666 };
        const result = await Portfolios.update(badDoc, update);
        if (result) { throw new Error('this block should not execute'); }
      } catch (err) {
        assert.equal(err, 'invalid portfolio update properties');
      }
    });

  });


  describe('.deletePortfolio()', () => {

    beforeEach((done) => {
      const collection = db.get().collection('portfolios');
      collection.deleteMany(() => {
        collection.insertMany(dummyPflos, (err) => {
          if (err) { console.log('error inserting portfolios:, err'); }
          done();
        });
      });
    });

    it('should be a function', () => {
      assert.isFunction(Portfolios.deletePortfolio);
    });

    // deletePortfolio = (owner, _id)
    it('should delete a portfolio', async () => {
      const result = await Portfolios.deletePortfolio(pfloOwner, pfloID1);
      assert.deepEqual(result.result.n,  1);
      assert.deepEqual(result.result.ok, 1);

      const pflo = await Portfolios.getOne(pfloOwner, pfloID1);
      assert.isNull(pflo);
    });

    it('should throw an error if "owner" param is omitted', async () => {
      try {
        const result = await Portfolios.deletePortfolio(null, pfloID1);
        if (result) { throw new Error('this block should not execute'); }
      } catch (err) {
        assert.equal(err, 'missing or invalid portfolio `owner`');
      }
    });

    it('should throw an error if "owner" is not a String', async () => {
      try {
        const result = await Portfolios.deletePortfolio(666, pfloID1);
        if (result) { throw new Error('this block should not execute'); }
      } catch (err) {
        assert.equal(err, 'missing or invalid portfolio `owner`');
      }
    });

    it('should throw an error if "_id" param is omitted', async () => {
      try {
        const result = await Portfolios.deletePortfolio(pfloOwner);
        if (result) { throw new Error('this block should not execute'); }
      } catch (err) {
        assert.equal(err, 'missing or invalid portfolio `_id`');
      }
    });

    it('should throw an error if "_id" is not a String', async () => {
      try {
        const result = await Portfolios.deletePortfolio(pfloOwner, 666);
        if (result) { throw new Error('this block should not execute'); }
      } catch (err) {
        assert.equal(err, 'missing or invalid portfolio `_id`');
      }
    });

  });


  /**
   * hasHolding = (owner, _id, ticker)
  */
  describe('.hasHolding()', () => {

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
      assert.isFunction(Portfolios.hasHolding);
    });

    it('should return "true" if portfolio has holding', async () => {
      const result = await Portfolios.hasHolding(pfloOwner, pfloID1, 'MSFT');
      assert.isTrue(result);
    });

    it('should return "false" if portfolio doesnt have holding', async () => {
      const result = await Portfolios.hasHolding(pfloOwner, pfloID1, 'GOOG');
      assert.isFalse(result);
    });

    it('should throw an error if "owner" omitted', async () => {
      try {
        const result = await Portfolios.hasHolding(null, pfloID1, 'MSFT');
        if (result) { throw new Error('this block should not execute'); }
      } catch (err) {
        assert.equal(err, 'missing or invalid portfolio `owner`');
      }

    });

    it('should throw an error if "owner" is not a String', async () => {
      try {
        const result = await Portfolios.hasHolding(666, pfloID1, 'MSFT');
        if (result) { throw new Error('this block should not execute'); }
      } catch (err) {
        assert.equal(err, 'missing or invalid portfolio `owner`');
      }

    });

    it('should throw an error if "_id" omitted', async () => {
      try {
        const result = await Portfolios.hasHolding(pfloOwner, null, 'MSFT');
        if (result) { throw new Error('this block should not execute'); }
      } catch (err) {
        assert.equal(err, 'missing or invalid portfolio `_id`');
      }

    });

    it('should throw an error if "_id" is not a String', async () => {
      try {
        const result = await Portfolios.hasHolding(pfloOwner, 666, 'MSFT');
        if (result) { throw new Error('this block should not execute'); }
      } catch (err) {
        assert.equal(err, 'missing or invalid portfolio `_id`');
      }

    });

    it('should throw an error if "ticker" omitted', async () => {
      try {
        const result = await Portfolios.hasHolding(pfloOwner, pfloID1);
        if (result) { throw new Error('this block should not execute'); }
      } catch (err) {
        assert.equal(err, 'missing or invalid portfolio `ticker`');
      }

    });

    it('should throw an error if "ticker" is not a String', async () => {
      try {
        const result = await Portfolios.hasHolding(pfloOwner, pfloID1, 666);
        if (result) { throw new Error('this block should not execute'); }
      } catch (err) {
        assert.equal(err, 'missing or invalid portfolio `ticker`');
      }

    });

  });


  /**
   * Add holding to portfolio
   * addHolding = ({owner, _id}, {ticker, qty})
   * @param    {String}   owner    User _id
   * @param    {String}   _id      Portfolio _id
   * @param    {String}   ticker   Holding's ticker symbol
   * @param    {Number}   qty      Qty of shares owned
   * @returns  {Object}            Updated portfolio
  */
  describe('.addHolding()', () => {

    beforeEach((done) => {
      const collection = db.get().collection('portfolios');
      collection.deleteMany(() => {
        collection.insertMany(dummyPflos, (err) => {
          if (err) { console.log('error inserting portfolios:, err'); }
          done();
        });
      });
    });

    it('should be a function', () => {
      assert.isFunction(Portfolios.addHolding);
    });

    it('should add a holding to a portfolio', async () => {
      const pflo    = { owner  : pfloOwner, _id : pfloID1 };
      const holding = { ticker : 'GOOG',    qty : 2 };
      const result  = await Portfolios.addHolding(pflo, holding);
      assert.lengthOf(result.holdings, 2);
    });
    
    it('added holdings should have all keys', async () => {
      const pflo     = { owner  : pfloOwner, _id : pfloID1 };
      const holding  = { ticker : 'GOOG',    qty : 2 };
      const hldgKeys = [ 'ticker', '_id', 'createdAt', 'updatedAt', 'qty' ];
      const result   = await Portfolios.addHolding(pflo, holding);
      assert.hasAllKeys(result.holdings[1], hldgKeys);
    });

    it('added holding\'s "ticker" should match input', async () => {
      const pflo    = { owner  : pfloOwner, _id : pfloID1 };
      const holding = { ticker : 'GOOG',    qty : 2 };
      const result  = await Portfolios.addHolding(pflo, holding);
      assert.equal(result.holdings[1].ticker, 'GOOG');
    });

    it('added holding\'s "qty" should match input', async () => {
      const pflo    = { owner  : pfloOwner, _id : pfloID1 };
      const holding = { ticker : 'GOOG',    qty : 2 };
      const result  = await Portfolios.addHolding(pflo, holding);
      assert.equal(result.holdings[1].qty, 2);
    });

    it('should throw an error if "owner" omitted', async () => {
      try {
        const pflo    = { owner  : null,   _id : pfloID1 };
        const holding = { ticker : 'GOOG', qty : 2 };
        const result  = await Portfolios.addHolding(pflo, holding);
        if (result) { throw new Error('this block should not execute'); }
      } catch (err) {
        assert.equal(err, 'missing or invalid portfolio `owner`');
      }
    });

    it('should throw an error if "owner" is not a string', async () => {
      try {
        const pflo    = { owner  : 666,    _id : pfloID1 };
        const holding = { ticker : 'GOOG', qty : 2 };
        const result  = await Portfolios.addHolding(pflo, holding);
        if (result) { throw new Error('this block should not execute'); }
      } catch (err) {
        assert.equal(err, 'missing or invalid portfolio `owner`');
      }
    });

    // it('should throw an error if "_id" omitted', async () => {
    //   try {
    //     const result = await Portfolios.hasHolding(pfloOwner, null, 'MSFT');
    //     if (result) { throw new Error('this block should not execute'); }
    //   } catch (err) {
    //     assert.equal(err, 'missing or invalid portfolio `_id`');
    //   }

    // });

    // it('should throw an error if "_id" is not a String', async () => {
    //   try {
    //     const result = await Portfolios.hasHolding(pfloOwner, 666, 'MSFT');
    //     if (result) { throw new Error('this block should not execute'); }
    //   } catch (err) {
    //     assert.equal(err, 'missing or invalid portfolio `_id`');
    //   }

    // });

    // it('should throw an error if "ticker" omitted', async () => {
    //   try {
    //     const result = await Portfolios.hasHolding(pfloOwner, pfloID1);
    //     if (result) { throw new Error('this block should not execute'); }
    //   } catch (err) {
    //     assert.equal(err, 'missing or invalid portfolio `ticker`');
    //   }

    // });

    // it('should throw an error if "ticker" is not a String', async () => {
    //   try {
    //     const result = await Portfolios.hasHolding(pfloOwner, pfloID1, 666);
    //     if (result) { throw new Error('this block should not execute'); }
    //   } catch (err) {
    //     assert.equal(err, 'missing or invalid portfolio `ticker`');
    //   }

    // });

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
