const { MAX_TODOS } = require('../constants');
const { Todo } = require('../../model');
const { withNoteStore, withApiErrorHandling } = require('../utils');

const {
  NoteStore: { NoteFilter, NotesMetadataResultSpec }
} = require('evernote');

module.exports = client =>
  withNoteStore(client)(async noteStore => {
    const notebookGuid = process.env.EVERNOTE_NOTEBOOK_ID;
    const filter = new NoteFilter({
      ascending: true,
      notebookGuid
    });
    const spec = new NotesMetadataResultSpec({
      includeTitle: true,
      includeAttributes: true
    });
    const rawResults = await withApiErrorHandling(noteStore.findNotesMetadata)(filter, 0, MAX_TODOS, spec);
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
