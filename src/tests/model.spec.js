/* eslint-disable no-undef */
// eslint-disable-next-line no-undef
const Model = require('../database/models/model');

describe('Model', () => {
  const model = new Model('Relation');
  let projection;

  beforeAll((done) => {
    projection = ['name'];
    expect(model.relation).toBe('Relation');
    expect(model.DB.query).toBeDefined();
    done();
  });

  describe('findById', () => {
    it('should throw an error if object id is not defined', async (done) => {
      const result = await model.findById(null, projection);
      expect(result).toMatch(/id must be given/);
      done();
    });

    it('should throw an error if the relation is not in the database', async (done) => {
      expectAsync(model.findById({ id: 1 }, projection)).toBeRejectedWith('Unable to fetch object: error: relation "relation" does not exist');
      done();
    });
  });

  describe('findByProps', () => {
    it('should throw an error if no table attribute is defined', async (done) => {
      const result = await model.findByProps(null, projection);
      expect(result).toMatch(/no attribute provided/);
      done();
    });

    it('should throw an error if prop is an empty object', async (done) => {
      const result = await model.findByProps({}, projection);
      expect(result).toMatch(/no attribute provided/);
      done();
    });

    it('should throw an error if the relation is not in the database', async (done) => {
      expectAsync(model.findByProps({ id: 1 }, projection)).toBeRejectedWith('Unable to fetch object: error: relation "relation" does not exist');
      done();
    });
  });

  describe('updateById', () => {
    it('should throw an error if no object id is defined', async (done) => {
      const result = await model.updateById(null, projection);
      expect(result).toMatch(/id must be given/);
      done();
    });

    it('should throw an error if prop is not defined', async (done) => {
      const result = await model.updateById(1, null);
      expect(result).toMatch(/no attribute provided/);
      done();
    });

    it('should throw an error if prop is an empty object', async (done) => {
      const result = await model.updateById(1, {});
      expect(result).toMatch(/no attribute provided/);
      done();
    });

    it('should throw an error if the relation is not in the database', async (done) => {
      expectAsync(model.updateById(1, projection)).toBeRejectedWith('Unable to fetch object: error: relation "relation" does not exist');
      done();
    });
  });

  describe('getRestriction', () => {
    const singleKeyProps = { id: 1 };
    const multiKeyProps = {
      id: 1,
      name: 'a',
    };

    describe('restrictionString', () => {
      it('should contain a space if props contain only one key/value pair', (done) => {
        const { restrictionString } = model.getRestriction(singleKeyProps);
        expect(restrictionString).not.toMatch(/ AND /g);
        done();
      });

      it('should contain a space if props contain more than one key/value pairs', (done) => {
        const { restrictionString } = model.getRestriction(multiKeyProps);
        expect(restrictionString).toMatch(/ AND /g);
        done();
      });
    });

    describe('values', () => {
      it('should be an array of one item if props contain only one key/value pair', (done) => {
        const { values } = model.getRestriction(singleKeyProps);
        expect(values.length).toEqual(1);
        done();
      });

      it('should be an array of multiple items if props contain more than one key/value pairs', (done) => {
        const { values } = model.getRestriction(multiKeyProps);
        expect(values.length).toBeGreaterThan(1);
        done();
      });
    });
  });
});
