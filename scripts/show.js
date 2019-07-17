#!/usr/bin/env node

const { getPath, WhatsGoingOnError, isDevMode } = require('../src/utils');
require('dotenv').config({ path: getPath('.env') });

const { SimpleMind } = require('../src/simple-mind');
const { Evernote } = require('../src/evernote');
const { Storage } = require('../src/storage');
const { fetchGmtOffset } = require('../src/timezone');

const run = async () => {
  try {
    const storage = new Storage();
    const ev = new Evernote({ storage });
    const sm = new SimpleMind({ storage });

    // Initialization
    const gmtOffset = await fetchGmtOffset();
    storage.setup();
    await sm.setup(gmtOffset);
    await ev.setup(gmtOffset);
    const simpleMind = await sm.retrieveTodos();
    const evernote = await ev.retrieveTodos();

    console.log('==========');
    console.log('SIMPLEMIND');
    console.log('==========\n');

    simpleMind.forEach(todo => console.log(`${todo.toString()}\n`));

    console.log('========');
    console.log('EVERNOTE');
    console.log('========\n');

    evernote.forEach(todo => console.log(`${todo.toString()}\n`));

    // Clean up
    await sm.teardown();
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
