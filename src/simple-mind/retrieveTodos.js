const { getTopics, filterTopicsForTodos, mapTopicsToTodoItems } = require('./utils');

module.exports = data =>
  getTopics(data)
    .filter(filterTopicsForTodos)
    .map(mapTopicsToTodoItems);
