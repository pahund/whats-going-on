const authorize = require('./authorize');
const changeTodos = require('./changeTodos');
const cleanUp = require('./cleanUp');
const createTodos = require('./createTodos');
const deleteTodos = require('./deleteTodos');
const downloadMindMap = require('./downloadMindMap');
const parseMindMapData = require('./parseMindMapData');
const retrieveMindMapXml = require('./retrieveMindMapXml');
const retrieveTodos = require('./retrieveTodos');
const uploadMindMap = require('./uploadMindMap');
const writeMindMapXml = require('./writeMindMapXml');

module.exports = {
  authorize,
  changeTodos,
  cleanUp,
  createTodos,
  deleteTodos,
  downloadMindMap,
  parseMindMapData,
  retrieveMindMapXml,
  retrieveTodos,
  uploadMindMap,
  writeMindMapXml
};
