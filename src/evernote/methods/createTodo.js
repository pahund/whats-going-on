const { withNoteStore } = require('../utils');

module.exports = (client, todo, order = Date.now()) =>
  withNoteStore(client)(async noteStore => {
    const notebookGuid = process.env.EVERNOTE_NOTEBOOK_ID;
    const { guid } = await noteStore.createNote({
      title: todo.title,
      content: '<!DOCTYPE en-note SYSTEM "http://xml.evernote.com/pub/enml2.dtd"><en-note />',
      notebookGuid,
      attributes: {
        reminderOrder: order,
        reminderTime: todo.deadline ? todo.deadline.getTime() : null,
        sourceURL: todo.url,
        reminderDoneTime: todo.done ? Date.now() : null
      }
    });
    return todo.change({ evernote: { id: guid, order } });
  });
