const { CACHE_PATH } = require('./constants');
const { Todo } = require('../model');
const {
  processTitleChange,
  processDoneChange,
  processDeadlineChange,
  processUrlChange,
  processOrderChange
} = require('./utils');
const { hasEntries } = require('../utils');

const simpleMind = Symbol('SimpleMind todos');
const evernote = Symbol('Evernote todos');
const cache = Symbol('Internally cached todos');
const storage = Symbol('Storage client');

module.exports = class {
  constructor({ storage: storageClient }) {
    this[simpleMind] = [];
    this[evernote] = [];
    this[cache] = [];
    this[storage] = storageClient;
  }

  async setup() {
    if (!(await this[storage].exists(CACHE_PATH))) {
      console.warn('No local todo cache found');
      return;
    }
    const rawCache = await this[storage].read(CACHE_PATH);
    this[cache] = JSON.parse(rawCache).map(data => new Todo(data));
    console.log(`Loaded ${this[cache].length} locally cached todo items`);
  }

  synchronize({ simpleMind, evernote }) {
    const next = {
      evernote: [],
      simpleMind: []
    };
    for (const simpleMindTodo of simpleMind) {
      const cachedTodo = this.findInCache(simpleMindTodo);
      if (!cachedTodo) {
        // (3) added in SimpleMind
        this.addToCache(simpleMindTodo);
        next.evernote.push(simpleMindTodo.add());
        continue;
      }
      const evernoteTodo = evernote.find(curr => curr.evernoteId === cachedTodo.evernoteId);
      if (!evernoteTodo) {
        // (2) removed in Evernote
        this.removeFromCache(cachedTodo);
        next.simpleMind.push(simpleMindTodo.remove());
        continue;
      }
      // (0) changed in Evernote or SimpleMind
      const changes = { simpleMind: {}, evernote: {}, cache: { evernote: {} } };
      processTitleChange({ simpleMindTodo, evernoteTodo, cachedTodo, changes });
      processDoneChange({ simpleMindTodo, evernoteTodo, cachedTodo, changes });
      processDeadlineChange({ simpleMindTodo, evernoteTodo, cachedTodo, changes });
      processUrlChange({ simpleMindTodo, evernoteTodo, cachedTodo, changes });
      processOrderChange({ evernoteTodo, cachedTodo, changes });
      if (hasEntries(changes.simpleMind)) {
        next.simpleMind.push(simpleMindTodo.change(changes.simpleMind));
      }
      if (hasEntries(changes.evernote)) {
        next.evernote.push(evernoteTodo.change(changes.evernote));
      }
      if (hasEntries(changes.cache)) {
        this.changeInCache(cachedTodo, changes.cache);
      }
    }
    for (const evernoteTodo of evernote) {
      const cachedTodo = this.findInCache(evernoteTodo);
      if (!cachedTodo) {
        // (4) added in Evernote
        this.addToCache(evernoteTodo);
        next.simpleMind.push(evernoteTodo.add());
        continue;
      }
      const simpleMindTodo = simpleMind.find(curr => curr.simpleMindId === cachedTodo.simpleMindId);
      if (!simpleMindTodo) {
        // (1) removed in SimpleMind
        this.removeFromCache(cachedTodo);
        next.evernote.push(evernoteTodo.remove());
      }
    }
    return next;
  }

  addToCache(todo) {
    this[cache].push(todo.clone());
  }

  removeFromCache(todo) {
    this[cache] = this[cache].filter(curr => curr !== todo);
  }

  findInCache(todo) {
    return this[cache].find(curr => {
      if (curr.simpleMindId !== null && todo.simpleMindId !== null) {
        return curr.simpleMindId === todo.simpleMindId;
      }
      if (curr.evernoteId !== null && todo.evernoteId !== null) {
        return curr.evernoteId === todo.evernoteId;
      }
      return false;
    });
  }

  updateCacheIds(todos) {
    todos.forEach(todo => {
      const cachedTodo = this.findInCache(todo);
      if (!cachedTodo) {
        return;
      }
      this.changeInCache(cachedTodo, {
        evernote: {
          id: cachedTodo.evernoteId || todo.evernoteId,
          order: cachedTodo.evernoteOrder || todo.evernoteOrder
        },
        simpleMind: { id: cachedTodo.simpleMindId || todo.simpleMindId }
      });
    });
  }

  changeInCache(todo, changes) {
    this.removeFromCache(todo);
    this.addToCache(todo.change(changes));
  }

  async teardown() {
    await this[storage].write(CACHE_PATH, JSON.stringify(this[cache]));
    console.log(`Saved ${this[cache].length} locally cached todo items`);
  }

  /* this is only used by the unit tests */
  getTestStatus() {
    return {
      cacheSize: this[cache].length
    };
  }
};
