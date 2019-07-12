#!/usr/bin/env node

const { getPath, WhatsGoingOnError, isDevMode } = require('../src/utils');
require('dotenv').config({ path: getPath('.env') });

const { Synchronizer } = require('../src/synchronizer');
const { ADDED, REMOVED, CHANGED } = require('../src/model');
const { SimpleMind } = require('../src/simple-mind');
const { Evernote } = require('../src/evernote');
const { fetchGmtOffset } = require('../src/timezone');

(async () => {
  try {
    const sync = new Synchronizer();
    const ev = new Evernote();
    const sm = new SimpleMind();

    // Initialization
    const gmtOffset = await fetchGmtOffset();
    sync.setup();
    await sm.setup(gmtOffset);
    await ev.setup(gmtOffset);
    const simpleMind = sm.retrieveTodos();
    const evernote = await ev.retrieveTodos();

    // Synchronization
    const result = sync.synchronize({ simpleMind, evernote });

    // Add todos to Evernote
    let addedEvernoteTodos = result.evernote.filter(todo => todo.status === ADDED);
    addedEvernoteTodos = await ev.createTodos(addedEvernoteTodos);
    sync.updateCacheIds(addedEvernoteTodos);

    // Remove todos from Evernote
    const removedEvernoteTodos = result.evernote.filter(todo => todo.status === REMOVED);
    await ev.deleteTodos(removedEvernoteTodos);

    // Change todos in Evernote
    const changedEvernoteTodos = result.evernote.filter(todo => todo.status === CHANGED);
    await ev.changeTodos(changedEvernoteTodos);

    // Add todos to SimpleMind
    let addedSimpleMindTodos = result.simpleMind.filter(todo => todo.status === ADDED);
    addedSimpleMindTodos = sm.createTodos(addedSimpleMindTodos);
    sync.updateCacheIds(addedSimpleMindTodos);

    // Remove todos from SimpleMind
    const removedSimpleMindTodos = result.simpleMind.filter(todo => todo.status === REMOVED);
    sm.deleteTodos(removedSimpleMindTodos);

    // Change todos in SimpleMind
    const changedSimpleMindTodos = result.simpleMind.filter(todo => todo.status === CHANGED);
    sm.changeTodos(changedSimpleMindTodos);

    // Clean up
    sync.teardown();
    await sm.teardown();

    // Report
    console.log(
      `
┌─────────┬────────────┬────────────┐
│         │  Evernote  │ SimpleMind │
├─────────┼────────────┼────────────┤
│ Added   │ ${`${ev.report.added}`.padStart(10)} │ ${`${sm.report.added}`.padStart(10)} │
├─────────┼────────────┼────────────┤
│ Changed │ ${`${ev.report.changed}`.padStart(10)} │ ${`${sm.report.changed}`.padStart(10)} │
├─────────┼────────────┼────────────┤
│ Removed │ ${`${ev.report.removed}`.padStart(10)} │ ${`${sm.report.removed}`.padStart(10)} │
└─────────┴────────────┴────────────┘
`.trim()
    );
  } catch (err) {
    if (isDevMode()) {
      console.log(err.stack);
    } else {
      console.error(err instanceof WhatsGoingOnError ? err.message : 'Oops – an unknown program error occurred');
    }
    process.exit(1);
  }
})();
