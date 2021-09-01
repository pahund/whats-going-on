#!/usr/bin/env node

const { getPath, WhatsGoingOnError, isDevMode } = require('../src/utils');
require('dotenv').config({ path: getPath('.env') });

const { Evernote } = require('../src/evernote');
const { Storage } = require('../src/storage');
const { fetchGmtOffset } = require('../src/timezone');

const run = async () => {
  try {
    const storage = new Storage();
    const ev = new Evernote({ storage });

    // Initialization
    const gmtOffset = await fetchGmtOffset();
    storage.setup();
    await ev.setup(gmtOffset);
    const notebooks = await ev.listNotebooks();
    console.log(`Evernote notebooks:\n\n${JSON.stringify(notebooks, null, 4)}`);
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
