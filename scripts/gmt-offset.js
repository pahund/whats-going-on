#!/usr/bin/env node

const { getPath, isDevMode, WhatsGoingOnError } = require('../src/utils');
require('dotenv').config({ path: getPath('.env') });

const { fetchGmtOffset } = require('../src/timezone');

const run = async () => {
  try {
    const gmtOffset = await fetchGmtOffset();
    console.log(`The GMT offset for the currently configured coordinates is ${gmtOffset} sec`);
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
