module.exports = ({ evernoteTodo, cachedTodo, changes }) => {
  // order is Evernote-specific, hence this is much simpler than in the other process* util functions
  if (evernoteTodo.evernoteOrder !== cachedTodo.evernoteOrder) {
    changes.cache.evernote.order = evernoteTodo.evernoteOrder;
  }
};
