#!/usr/bin/env node

const { Synchronizer } = require('../src/synchronizer');
const { Builder } = require('xml2js');
const { ADDED, REMOVED } = require('../src/model');
const sm = require('../src/simple-mind');
const ev = require('../src/evernote');

(async () => {
  const report = {
    simpleMind: {
      added: 0,
      removed: 0,
      changed: 0
    },
    evernote: {
      added: 0,
      removed: 0,
      changed: 0
    }
  };
  const sync = new Synchronizer();
  const builder = new Builder();

  // Initialization
  sync.loadCache();
  const simpleMindAuth = await sm.authorize();
  await sm.downloadMindMap(simpleMindAuth);
  let xml = await sm.retrieveMindMapXml();
  let simpleMindRawData = await sm.parseMindMapData(xml);
  const simpleMind = await sm.retrieveTodos(simpleMindRawData);
  const evernoteClient = await ev.authorize();
  const evernote = await ev.retrieveTodos(evernoteClient);

  // Synchronization
  const result = sync.synchronize({ simpleMind, evernote });

  // Add todos to Evernote
  let addedEvernoteTodos = result.evernote.filter(todo => todo.status === ADDED);
  addedEvernoteTodos = await ev.createTodos(evernoteClient, addedEvernoteTodos);
  sync.updateCacheIds(addedEvernoteTodos);
  report.evernote.added = addedEvernoteTodos.length;

  // Remove todos from Evernote
  const removedEvernoteTodos = result.evernote.filter(todo => todo.status === REMOVED);
  await ev.deleteTodos(evernoteClient, removedEvernoteTodos);
  report.evernote.removed = removedEvernoteTodos.length;

  // Add todos to SimpleMind
  let addedSimpleMindTodos = result.simpleMind.filter(todo => todo.status === ADDED);
  [simpleMindRawData, addedSimpleMindTodos] = sm.createTodos(simpleMindRawData, addedSimpleMindTodos);
  sync.updateCacheIds(addedSimpleMindTodos);
  report.simpleMind.added = addedSimpleMindTodos.length;

  // Remove todos from SimpleMind
  const removedSimpleMindTodos = result.simpleMind.filter(todo => todo.status === REMOVED);
  simpleMindRawData = sm.deleteTodos(simpleMindRawData, removedSimpleMindTodos);
  report.simpleMind.removed = removedSimpleMindTodos.length;

  // Clean up
  sync.saveCache();
  xml = builder.buildObject(simpleMindRawData);
  await sm.writeMindMapXml(xml);
  await sm.uploadMindMap(simpleMindAuth);
  await sm.cleanUp();

  // Report
  console.log(
    `
┌─────────┬────────────┬────────────┐
│         │  Evernote  │ SimpleMind │
├─────────┼────────────┼────────────┤
│ Added   │ ${`${report.evernote.added}`.padStart(10)} │ ${`${report.simpleMind.added}`.padStart(10)} │
├─────────┼────────────┼────────────┤
│ Changed │ ${`${report.evernote.changed}`.padStart(10)} │ ${`${report.simpleMind.changed}`.padStart(10)} │
├─────────┼────────────┼────────────┤
│ Removed │ ${`${report.evernote.removed}`.padStart(10)} │ ${`${report.simpleMind.removed}`.padStart(10)} │
└─────────┴────────────┴────────────┘
`.trim()
  );
})();
