#!/usr/bin/env node

const sm = require('../src/simple-mind');
const ev = require('../src/evernote');

(async () => {
  const simpleMindAuth = await sm.authorize();
  await sm.downloadMindMap(simpleMindAuth);
  const xml = await sm.retrieveMindMapXml();
  const simpleMindRawData = await sm.parseMindMapData(xml);
  const todos = await sm.retrieveTodos(simpleMindRawData);
  await sm.cleanUp();
  const evernoteClient = await ev.authorize();
  const updatedTodos = await ev.createTodos(evernoteClient, todos);
  updatedTodos.forEach(todo => console.log(`${todo}`));
})();
