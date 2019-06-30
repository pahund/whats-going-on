const { NOTEBOOK_ID, MAX_TODOS } = require('./constants');
const { Todo } = require('../model');
const { withNoteStore } = require('./utils');

const {
  NoteStore: { NoteFilter, NotesMetadataResultSpec }
} = require('evernote');

module.exports = client =>
  withNoteStore(client)(async noteStore => {
    const filter = new NoteFilter({
      ascending: true,
      notebookGuid: NOTEBOOK_ID
    });
    const spec = new NotesMetadataResultSpec({
      includeTitle: true,
      includeAttributes: true
    });
    const rawResults = await noteStore.findNotesMetadata(filter, 0, MAX_TODOS, spec);
    return rawResults.notes
      .filter(note => note.attributes.reminderOrder !== null)
      .map(
        ({ guid, title, attributes: { reminderTime, reminderDoneTime, reminderOrder, sourceURL } }) =>
          new Todo({
            title,
            done: reminderDoneTime !== null,
            evernote: { id: guid, order: reminderOrder },
            deadline: reminderTime ? new Date(reminderTime) : null,
            url: sourceURL
          })
      );
  });
