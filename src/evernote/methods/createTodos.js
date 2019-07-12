const createTodo = require('./createTodo');
const { REQUEST_BATCH_SIZE, REQUEST_BATCH_INTERVAL } = require('../constants');
const { executedBatched } = require('../../utils');

module.exports = async (client, todos) => {
  // order should never be higher than latest timestamp and two notes in Evernote should not have the
  // same timestamp, hence we start out with current time and subtract one ms for each not created
  let order = Date.now();
  return await executedBatched(
    todos,
    async todo => await createTodo(client, todo, order--),
    REQUEST_BATCH_SIZE,
    REQUEST_BATCH_INTERVAL
  );
};
