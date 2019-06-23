#!/usr/bin/env node

const { authorize, fetchTodo } = require("../src/evernote");

(async () => {
  const client = await authorize();
  const note = await fetchTodo(client);
  console.log("note:", note);
})();
