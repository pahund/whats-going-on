const { getPath } = require('./src/utils');
require('dotenv').config({ path: getPath('.env') });
// const synchronize = require('./scripts/synchronize');
const synchronize = require('./scripts/gmt-offset');

const getTime = () => new Date().toISOString();

const log = msg => console.log(`[${getTime()}] ${msg}`);

const run = async () => {
  log('STARTING SYNC');
  const result = await synchronize();
  log(result === 0 ? 'SUCCESS' : 'FAILURE');
};

run();
setInterval(run, process.env.SYNC_INTERVAL * 1000);
