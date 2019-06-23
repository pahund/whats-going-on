const { NOTEBOOK_ID, MAX_TODOS } = require("./constants");
const { Todo } = require("../model");

const {
  NoteStore: { NoteFilter, NotesMetadataResultSpec }
} = require("evernote");

module.exports = async client => {
  const noteStore = client.getNoteStore();
  const filter = new NoteFilter({
    ascending: true,
    notebookGuid: NOTEBOOK_ID
  });
  const spec = new NotesMetadataResultSpec({
    includeTitle: true,
    includeAttributes: true
  });
  const rawResults = await noteStore.findNotesMetadata(
    filter,
    0,
    MAX_TODOS,
    spec
  );
  return rawResults.notes
    .filter(note => note.attributes.reminderOrder !== null)
    .map(
      ({
        guid,
        title,
        attributes: { reminderTime, reminderDoneTime, sourceURL }
      }) =>
        new Todo({
          title,
          done: reminderDoneTime !== null,
          evernote: { id: guid },
          deadline: reminderTime ? new Date(reminderTime) : null,
          url: sourceURL
        })
    );
};
