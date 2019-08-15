#!/usr/bin/env node

const { getPath, WhatsGoingOnError, isDevMode } = require('../src/utils');
require('dotenv').config({ path: getPath('.env') });

const { Evernote } = require('../src/evernote');
const { fetchGmtOffset } = require('../src/timezone');
const { Storage } = require('../src/storage');
const { Todo } = require('../src/model');

const run = async title => {
  try {
    const storage = new Storage();
    const ev = new Evernote({ storage });

    // Initialization
    storage.setup();
    const gmtOffset = await fetchGmtOffset();
    await ev.setup(gmtOffset);

    // Add todo to Evernote
    const todo = await ev.createTodo(new Todo({ title }));
    console.log(todo.toString());
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
