const withNoteStore = require('./withNoteStore');

module.exports = (client, todo) =>
  withNoteStore(client)(async noteStore => {
    await noteStore.deleteNote(todo.evernoteId);
  });
