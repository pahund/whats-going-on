module.exports = (simpleMindTodo, evernoteTodo, cachedTodo, changes) => {
  // careful, we can't use simpleMindTodo.deadline !== evernoteTodo.deadline here,
  // because two date objects are different even if they contain the same date
  if (simpleMindTodo.hasDifferentDeadlineThan(evernoteTodo)) {
    if (cachedTodo.hasSameDeadlineAs(simpleMindTodo)) {
      // deadline changed in Evernote
      changes.simpleMind.deadline = evernoteTodo.deadline;
      changes.cache.deadline = evernoteTodo.deadline;
    } else {
      // deadline changed in SimpleMind or both (SimpleMind wins)
      changes.evernote.deadline = simpleMindTodo.deadline;
      changes.cache.deadline = simpleMindTodo.deadline;
    }
  } else if (cachedTodo.hasDifferentDeadlineThan(simpleMindTodo)) {
    // deadline changed to the same date in Evernote and SimpleMind
    changes.cache.deadline = simpleMindTodo.deadline;
  }
};
