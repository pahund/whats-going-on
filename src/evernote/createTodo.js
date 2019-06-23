const { NOTEBOOK_ID } = require("./constants");
const withNoteStore = require("./withNoteStore");

module.exports = (client, todo) =>
  withNoteStore(client)(async noteStore => {
    let guid;
    try {
      ({ guid } = await noteStore.createNote({
        title: todo.title,
        content:
          '<!DOCTYPE en-note SYSTEM "http://xml.evernote.com/pub/enml2.dtd"><en-note />',
        notebookGuid: NOTEBOOK_ID,
        attributes: {
          reminderOrder: 0,
          reminderTime: todo.deadline ? todo.deadline.getTime() : null,
          sourceURL: todo.url ? todo.url : null,
          reminderDoneTime: todo.done ? Date.now() : null
        }
      }));
    } catch (err) {
      throw new Error("Failed to create todo note on Evernote", err);
    }
    return todo.change({ evernote: { id: guid } });
  });
