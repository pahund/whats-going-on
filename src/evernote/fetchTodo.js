const withNoteStore = require('./withNoteStore');

module.exports = (client, id) =>
  withNoteStore(client)(async noteStore => {
    return await noteStore.getNote(id, true, true, true, true);
  });
