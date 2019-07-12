const { withNoteStore } = require('../utils');

module.exports = (client, todo) =>
  withNoteStore(client)(
    async noteStore =>
      await noteStore.updateNote({
        guid: todo.evernoteId,
        title: todo.title,
        attributes: {
          reminderDoneTime: todo.done ? Date.now() : null,
          reminderTime: todo.deadline ? todo.deadline.getTime() : null,
          sourceURL: todo.url,
          reminderOrder: todo.evernoteOrder
        }
      })
  );
