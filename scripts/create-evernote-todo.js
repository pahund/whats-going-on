#!/usr/bin/env node

const { authorize, createTodo } = require("../src/evernote");
const { Todo } = require("../src/model");

(async () => {
  const client = await authorize();
  const todo = new Todo({
    title: "Does it still work?",
  });
  const evernoteTodo = await createTodo(client, todo);
  console.log(`${evernoteTodo}`);
})();
