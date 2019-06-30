const { withNoteStore } = require('./utils');

module.exports = (client, todo) =>
  withNoteStore(client)(async noteStore => {
    await noteStore.deleteNote(todo.evernoteId);
  });
