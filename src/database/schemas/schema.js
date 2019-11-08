const EventEmmiter = require('events');
const pgClient = require('../../config/db');

module.exports = (relation, relationSchema) => {
  const emitter = new EventEmmiter();
  emitter.on('done', () => console.log(`'${relation} table created'`));

  return async () => {
    try {
      await pgClient.query(relationSchema());
      emitter.emit('done');
    } catch (error) {
      console.log(`Unable to create table ${relation}::: ${error}`);
    }
  };
};
