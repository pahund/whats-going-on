#!/usr/bin/env node

const {
  downloadMindMap,
  authorize,
  retrieveMindMapData,
  retrieveTodos,
  cleanUp
} = require("../src/simple-mind");

(async () => {
  const simpleMindAuth = await authorize();
  await downloadMindMap(simpleMindAuth);
  const simpleMindRawData = await retrieveMindMapData();
  const todos = await retrieveTodos(simpleMindRawData);
  await cleanUp();
  todos.forEach(todo => console.log(`${todo}`));
})();
