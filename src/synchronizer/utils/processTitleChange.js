module.exports = ({ simpleMindTodo, evernoteTodo, cachedTodo, changes }) => {
  if (simpleMindTodo.title !== evernoteTodo.title) {
    if (cachedTodo.title === simpleMindTodo.title) {
      // title changed in Evernote
      changes.simpleMind.title = evernoteTodo.title;
      changes.cache.title = evernoteTodo.title;
    } else {
      // title changed in SimpleMind or both (SimpleMind wins)
      changes.evernote.title = simpleMindTodo.title;
      changes.cache.title = simpleMindTodo.title;
    }
  } else if (cachedTodo.title !== simpleMindTodo.title) {
    // title changed to the same value in Evernote and SimpleMind
    changes.cache.title = simpleMindTodo.title;
  }
};
