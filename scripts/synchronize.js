#!/usr/bin/env node

const { getPath, WhatsGoingOnError, isDevMode } = require('../src/utils');
require('dotenv').config({ path: getPath('.env') });

const { Synchronizer } = require('../src/synchronizer');
const { ADDED, REMOVED, CHANGED } = require('../src/model');
const { SimpleMind } = require('../src/simple-mind');
const { Evernote } = require('../src/evernote');
const { fetchGmtOffset } = require('../src/timezone');
const { Storage } = require('../src/storage');

const run = async () => {
  try {
    const storage = new Storage();
    const sync = new Synchronizer({ storage });
    const ev = new Evernote({ storage });
    const sm = new SimpleMind({ storage });

    // Initialization
    storage.setup();
    const gmtOffset = await fetchGmtOffset();
    await sync.setup();
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
    await sync.teardown();
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
    return 1;
  }
  return 0;
};

if (require.main === module) {
  (async () => {
    process.exit(await run());
  })();
}

module.exports = run;
