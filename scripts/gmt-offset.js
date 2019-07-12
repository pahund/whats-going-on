#!/usr/bin/env node

const { getPath } = require('../src/utils');
require('dotenv').config({ path: getPath('.env') });

const { fetchGmtOffset } = require('../src/timezone');

(async () => {
  const gmtOffset = await fetchGmtOffset();
  console.log(`The GMT offset for the currently configured coordinates is ${gmtOffset} sec`);
})();
