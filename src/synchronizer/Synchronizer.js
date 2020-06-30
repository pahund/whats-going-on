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
    const hasCache = await this[storage].exists(CACHE_PATH);
    if (!hasCache) {
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
      // console.log(`Processing SM todo ”${simpleMindTodo.title}”`);
      const cachedTodo = this.findInCache(simpleMindTodo);
      if (!cachedTodo) {
        // (3) added in SimpleMind
        console.log(`(3) Added in SimpleMind:\n${simpleMindTodo}`);
        this.addToCache(simpleMindTodo);
        console.log('* Added to cache');
        next.evernote.push(simpleMindTodo.add());
        console.log('* Going to add to Evernote');
        continue;
      }
      const evernoteTodo = evernote.find(curr => curr.evernoteId === cachedTodo.evernoteId);
      if (!evernoteTodo) {
        // (2) removed in Evernote
        console.log(`(2) Removed in Evernote:\n${simpleMindTodo}`);
        this.removeFromCache(cachedTodo);
        console.log('* Removed from cache');
        next.simpleMind.push(simpleMindTodo.remove());
        console.log('* Going to remove from SimpleMind');
        continue;
      }
      // (0) changed in Evernote or SimpleMind
      const changes = { simpleMind: {}, evernote: {}, cache: {} };
      processTitleChange({ simpleMindTodo, evernoteTodo, cachedTodo, changes });
      processDoneChange({ simpleMindTodo, evernoteTodo, cachedTodo, changes });
      processDeadlineChange({ simpleMindTodo, evernoteTodo, cachedTodo, changes });
      processUrlChange({ simpleMindTodo, evernoteTodo, cachedTodo, changes });
      processOrderChange({ evernoteTodo, cachedTodo, changes });
      if (hasEntries(changes.simpleMind)) {
        console.log(`(0) Changed in Evernote:\n${evernoteTodo}`);
        next.simpleMind.push(simpleMindTodo.change(changes.simpleMind));
        console.log('* Going to change in SimpleMind');
      }
      if (hasEntries(changes.evernote)) {
        console.log(`(0) Changed in SimpleMind:\n${simpleMindTodo}`);
        next.evernote.push(evernoteTodo.change(changes.evernote));
        console.log('* Going to change in Evernote');
      }
      if (hasEntries(changes.cache)) {
        this.changeInCache(cachedTodo, changes.cache);
        console.log('* Changed in cache');
      }
    }
    for (const evernoteTodo of evernote) {
      // console.log(`Processing Ev todo ”${evernoteTodo.title}”`);
      const cachedTodo = this.findInCache(evernoteTodo);
      if (!cachedTodo) {
        // (4) added in Evernote
        console.log(`(4) Added in Evernote:\n${evernoteTodo}`);
        this.addToCache(evernoteTodo);
        console.log('* Added to cache');
        next.simpleMind.push(evernoteTodo.add());
        console.log('* Going to add to SimpleMind');
        continue;
      }
      const simpleMindTodo = simpleMind.find(curr => curr.simpleMindId === cachedTodo.simpleMindId);
      if (!simpleMindTodo) {
        // (1) removed in SimpleMind
        console.log(`(1) Removed in SimpleMind:\n${evernoteTodo}`);
        this.removeFromCache(cachedTodo);
        console.log('* Removed from cache');
        next.evernote.push(evernoteTodo.remove());
        console.log('* Going to remove from Evernote');
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
