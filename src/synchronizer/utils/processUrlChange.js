module.exports = ({ simpleMindTodo, evernoteTodo, cachedTodo, changes }) => {
  if (simpleMindTodo.url !== evernoteTodo.url) {
    if (cachedTodo.url === simpleMindTodo.url) {
      // URL changed in Evernote
      changes.simpleMind.url = evernoteTodo.url;
      changes.cache.url = evernoteTodo.url;
    } else {
      // URL changed in SimpleMind or both (SimpleMind wins)
      changes.evernote.url = simpleMindTodo.url;
      changes.cache.url = simpleMindTodo.url;
    }
  } else if (cachedTodo.url !== simpleMindTodo.url) {
    // URL changed to the same date in Evernote and SimpleMind
    changes.cache.url = simpleMindTodo.url;
  }
};
