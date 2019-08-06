const { getPath } = require('./src/utils');
require('dotenv').config({ path: getPath('.env') });
const synchronize = require('./scripts/synchronize');
const deleteCache = require('./scripts/delete-cache');
const express = require('express');

const PORT = process.env.PORT || 8080;

const app = express();

app.get('/', (req, res) => {
  res
    .status(200)
    .send("What's going on?")
    .end();
});

app.get('/sync', async (req, res) => {
  console.log('STARTING SYNC');
  const result = await synchronize();
  if (result === 0) {
    console.log('SUCCESS');
    res
      .status(200)
      .send('Synchronization successful')
      .end();
  } else {
    console.log('FAILURE');
    res
      .status(200)
      .send('Synchronization failed')
      .end();
  }
});

app.get('/delete-cache', async (req, res) => {
  console.log('DELETING CACHE');
  const result = await deleteCache();
  if (result === 0) {
    console.log('SUCCESS');
    res
      .status(200)
      .send('Cache successfully deleted')
      .end();
  } else {
    console.log('FAILURE');
    res
      .status(200)
      .send('Failed to delete cache')
      .end();
  }
});

app.listen(PORT, () => console.log(`App listening on port ${PORT}`));
