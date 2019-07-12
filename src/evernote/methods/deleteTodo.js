const { withNoteStore } = require('../utils');

// Note: We are not actually deleting any notes in Evernot, we just remove
// the reminder from the note – the user may have info in the note's content
// that they do not want deleted.
// See issue on GitHub: https://github.com/pahund/whats-going-on/issues/43
module.exports = (client, todo) =>
  withNoteStore(client)(
    async noteStore =>
      await noteStore.updateNote({
        guid: todo.evernoteId,
        title: todo.title,
        attributes: {
          reminderDoneTime: null,
          reminderTime: null,
          sourceURL: todo.url,
          reminderOrder: null
        }
      })
  );

// module.exports = (client, todo) =>
//   withNoteStore(client)(async noteStore => {
//     await noteStore.deleteNote(todo.evernoteId);
//   });
