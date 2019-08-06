#!/usr/bin/env node

const { getPath, WhatsGoingOnError, isDevMode } = require('../src/utils');
require('dotenv').config({ path: getPath('.env') });
const { Storage } = require('../src/storage');
const { CACHE_PATH } = require('../src/synchronizer/constants');

const run = async () => {
  try {
    const storage = new Storage();

    storage.setup();
    await storage.delete(CACHE_PATH);
    console.log('Cache was deleted');
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
