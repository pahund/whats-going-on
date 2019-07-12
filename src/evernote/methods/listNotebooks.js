const { withNoteStore, withApiErrorHandling } = require('../utils');

module.exports = client =>
  withNoteStore(client)(async noteStore => await withApiErrorHandling(noteStore.listNotebooks)());
