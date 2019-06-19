const NOTE_ID = 'dfe8364a-9c37-4aa1-abb7-b9d4d7451487';

module.exports = async client => {
  const noteStore = client.getNoteStore();
  try {
    return await noteStore.getNote(NOTE_ID, true, true, true, true);
  } catch (err) {
    console.error('nope', err);
  }
};
