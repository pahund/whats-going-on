const withNoteStore = require('./withNoteStore');
const { hasEntries } = require('../utils');

module.exports = (client, todo) =>
  withNoteStore(client)(async noteStore => {
    const options = {
      guid: todo.evernoteId,
      title: todo.title // note title must always be set, even if it wasn't changed
    };
    const attributes = {};
    if (todo.doneChanged) {
      attributes.reminderDoneTime = todo.done ? Date.now() : null;
    }
    if (todo.deadlineChanged) {
      attributes.reminderTime = todo.deadline ? todo.deadline.getTime() : null;
    }
    if (todo.urlChanged) {
      attributes.sourceURL = todo.url;
    }
    if (hasEntries(attributes)) {
      // this is unfortunately necessary, otherwise the not won't be a todo anymore in Evernote
      // It will cause the item to be bumped up to the top of the list in Evernot, which is undesired,
      // but there's no easy fix – see https://github.com/pahund/whats-going-on/issues/38
      attributes.reminderOrder = Date.now();
      options.attributes = attributes;
    }
    await noteStore.updateNote(options);
  });
