const { getPath } = require('./src/utils');
require('dotenv').config({ path: getPath('.env') });
const synchronize = require('./scripts/synchronize');
const deleteCache = require('./scripts/delete-cache');
const createEvernoteTodo = require('./scripts/create-evernote-todo');
const express = require('express');

const PORT = process.env.PORT || 8080;

const app = express();

app.use(express.json());

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
      .status(500)
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
      .status(500)
      .send('Failed to delete cache')
      .end();
  }
});

app.post('/create-todo', async (req, res) => {
  console.log('CREATING TODO');
  const {
    body: { secret, title }
  } = req;
  if (!title) {
    const msg = 'Missing title in JSON post body';
    console.error(msg);
    console.log('FAILURE');
    res.status(400).send(msg);
    return;
  }
  if (!secret) {
    const msg = 'Missing secret in JSON post body';
    console.error(msg);
    console.log('FAILURE');
    res.status(400).send(msg);
    return;
  }
  if (secret !== process.env.CREATE_TODO_ENDPOINT_SECRET) {
    const msg = 'Invalid secret';
    console.error(msg);
    console.log('FAILURE');
    res.status(401).send(msg);
    return;
  }
  const result = await createEvernoteTodo(title);
  if (result === 0) {
    console.log('SUCCESS');
    res
      .status(200)
      .send('New todo successfully created in Evernote')
      .end();
  } else {
    console.log('FAILURE');
    res
      .status(500)
      .send('Creating new todo in Evernote failed')
      .end();
  }
});

app.listen(PORT, () => console.log(`App listening on port ${PORT}`));
