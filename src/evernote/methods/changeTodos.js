const changeTodo = require('./changeTodo');
const { REQUEST_BATCH_SIZE, REQUEST_BATCH_INTERVAL } = require('../constants');
const { executedBatched } = require('../../utils');

module.exports = async (client, todos) =>
  await executedBatched(
    todos,
    async todo => await changeTodo(client, todo),
    REQUEST_BATCH_SIZE,
    REQUEST_BATCH_INTERVAL
  );
