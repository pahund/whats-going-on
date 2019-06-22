const { NOTEBOOK_ID, MAX_TODOS } = require("./constants");
const { Todo } = require('../model');

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
    .map(({ guid, title, attributes: { reminderTime, reminderDoneTime, sourceURL } }) => {
      const todo = new Todo({
        text: title,
        done: reminderDoneTime !== null,
        evernote: { id: guid }
      });
      if (reminderTime) {
        todo.date = new Date(reminderTime);
      }
      if (sourceURL) {
        todo.url = sourceURL;
      }
      return todo;
    });
};
