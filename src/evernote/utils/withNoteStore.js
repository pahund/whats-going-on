module.exports = client => {
  const noteStore = client.getNoteStore();
  return func => func(noteStore);
};
