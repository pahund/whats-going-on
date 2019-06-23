const NOTE_ID = "daa0e4ed-174e-47b9-8ae7-7e375e94f822";
const withNoteStore = require("./withNoteStore");

module.exports = client =>
  withNoteStore(client)(async () => {
    const noteStore = client.getNoteStore();
    try {
      return await noteStore.getNote(NOTE_ID, true, true, true, true);
    } catch (err) {
      console.error("nope", err);
    }
  });
