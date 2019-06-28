#!/usr/bin/env node

const { authorize, fetchTodo } = require('../src/evernote');

(async () => {
  const client = await authorize();
  const note = await fetchTodo(client, 'daa0e4ed-174e-47b9-8ae7-7e375e94f822');
  console.log('note:', note);
})();
