const { NOTEBOOK_ID } = require('./constants');
const { withNoteStore } = require('./utils');

module.exports = (client, todo) =>
  withNoteStore(client)(async noteStore => {
    const { guid } = await noteStore.createNote({
      title: todo.title,
      content: '<!DOCTYPE en-note SYSTEM "http://xml.evernote.com/pub/enml2.dtd"><en-note />',
      notebookGuid: NOTEBOOK_ID,
      attributes: {
        reminderOrder: Date.now(),
        reminderTime: todo.deadline ? todo.deadline.getTime() : null,
        sourceURL: todo.url,
        reminderDoneTime: todo.done ? Date.now() : null
      }
    });
    return todo.change({ evernote: { id: guid } });
  });
