const { getPath } = require('./src/utils');
require('dotenv').config({ path: getPath('.env') });
const synchronize = require('./scripts/synchronize');
const express = require('express');

const getTime = () => new Date().toISOString();

const log = msg => console.log(`[${getTime()}] ${msg}`);

const run = async () => {
  log('STARTING SYNC');
  const result = await synchronize();
  log(result === 0 ? 'SUCCESS' : 'FAILURE');
};

const PORT = process.env.PORT || 8080;

const app = express();

app.get('/', (req, res) => {
  res
    .status(200)
    .send("What's going on?")
    .end();
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
  run();
  setInterval(run, process.env.SYNC_INTERVAL * 1000);
});
