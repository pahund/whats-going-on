#!/usr/bin/env node

const { getPath, WhatsGoingOnError, isDevMode } = require('../src/utils');
require('dotenv').config({ path: getPath('.env') });

const { SimpleMind } = require('../src/simple-mind');
const { Evernote } = require('../src/evernote');

(async () => {
  try {
    const ev = new Evernote();
    const sm = new SimpleMind();

    // Initialization
    await sm.setup();
    await ev.setup();
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
    process.exit(1);
  }
})();
