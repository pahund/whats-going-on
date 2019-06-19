const { NOTEBOOK_ID } = require("./constants");

module.exports = async client => {
  const noteStore = client.getNoteStore();
  try {
    await noteStore.createNote({
      title: 'FUCK IT!!1!',
      content: '<!DOCTYPE en-note SYSTEM "http://xml.evernote.com/pub/enml2.dtd"><en-note>Oh happy day</en-note>',
      notebookGuid: NOTEBOOK_ID
    });
  } catch (err) {
    console.error('nope', err);
  }
};
