const authorize = require('./authorize');
const retrieveTodos = require('./retrieveTodos');
const createTodo = require('./createTodo');
const createTodos = require('./createTodos');
const changeTodo = require('./changeTodo');
const changeTodos = require('./changeTodos');
const fetchTodo = require('./fetchTodo');
const deleteTodo = require('./deleteTodo');
const deleteTodos = require('./deleteTodos');

module.exports = {
  authorize,
  retrieveTodos,
  createTodo,
  createTodos,
  fetchTodo,
  deleteTodo,
  deleteTodos,
  changeTodo,
  changeTodos
};
