#!/usr/bin/env node
const { Builder } = require('xml2js');

const {
  downloadMindMap,
  authorize,
  retrieveMindMapXml,
  parseMindMapData,
  updateMindMapData,
  retrieveTodos,
  writeMindMapXml,
  uploadMindMap,
  cleanUp
} = require('../src/simple-mind');

(async () => {
  const simpleMindAuth = await authorize();
  await downloadMindMap(simpleMindAuth);
  const xml = await retrieveMindMapXml();
  const data = await parseMindMapData(xml);
  const todos = retrieveTodos(data);
  todos[0] = todos[0].change({ title: 'I WAS CHANGED!!1!!' });
  const data2 = updateMindMapData(data, todos);
  const builder = new Builder();
  const xml2 = builder.buildObject(data2);
  await writeMindMapXml(xml2);
  await uploadMindMap(simpleMindAuth);
  await cleanUp();
})();
