module.exports = (simpleMindTodo, evernoteTodo, cachedTodo, changes) => {
  if (simpleMindTodo.done !== evernoteTodo.done) {
    if (cachedTodo.done === simpleMindTodo.done) {
      // done status changed in Evernote
      changes.simpleMind.done = evernoteTodo.done;
      changes.cache.done = evernoteTodo.done;
    } else {
      // done status changed in SimpleMind or both (SimpleMind wins)
      changes.evernote.done = simpleMindTodo.done;
      changes.cache.done = simpleMindTodo.done;
    }
  } else if (cachedTodo.done !== simpleMindTodo.done) {
    // done status changed to the same value in Evernote and SimpleMind
    changes.cache.done = simpleMindTodo.done;
  }
};
