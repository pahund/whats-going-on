#!/usr/bin/env node

const { authorize, createTodos } = require("../src/evernote");
const { Todo } = require("../src/model");

(async () => {
  const client = await authorize();
  const todos = [];
  for (let i = 0; i < 3; i++) {
    todos.push(
      new Todo({
        title: `Mein Todo ${i + 1}`
      })
    );
  }
  const updatedTodos = await createTodos(client, todos);
  updatedTodos.forEach(todo => console.log(`${todo}`));
})();
