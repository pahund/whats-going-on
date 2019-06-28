const createTodo = require('./createTodo');
const { REQUEST_BATCH_SIZE, REQUEST_BATCH_INTERVAL } = require('./constants');
const { executedBatched } = require('../utils');

module.exports = async (client, todos) =>
  await executedBatched(
    todos,
    async todo => await createTodo(client, todo),
    REQUEST_BATCH_SIZE,
    REQUEST_BATCH_INTERVAL
  );
