#!/usr/bin/env node

const {
  downloadMindMap,
  authorize,
  retrieveMindMapXml,
  parseMindMapData,
  retrieveTodos,
  cleanUp
} = require('../src/simple-mind');

(async () => {
  const simpleMindAuth = await authorize();
  await downloadMindMap(simpleMindAuth);
  const xml = await retrieveMindMapXml();
  const simpleMindRawData = await parseMindMapData(xml);
  const todos = await retrieveTodos(simpleMindRawData);
  await cleanUp();
  todos.forEach(todo => console.log(`${todo}`));
})();
