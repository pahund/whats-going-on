const { readFileSync, existsSync, writeFileSync } = require('fs');
const { CACHE_PATH } = require('./constants');
const { Todo } = require('../model');

const simpleMind = Symbol('SimpleMind todos');
const evernote = Symbol('Evernote todos');
const cache = Symbol('Internally cached todos');

module.exports = class {
  constructor() {
    this[simpleMind] = [];
    this[evernote] = [];
    this[cache] = [];
  }

  loadCache() {
    if (!existsSync(CACHE_PATH)) {
      console.warn('No local todo cache found');
      return;
    }
    const rawCache = readFileSync(CACHE_PATH);
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
      const evernoteTodo = evernote.find(curr => curr.evernoteId === cachedTodo.evernoteId) || null;
      if (!evernoteTodo) {
        // (2) removed in Evernote
        this.removeFromCache(cachedTodo);
        next.simpleMind.push(simpleMindTodo.remove());
        // noinspection UnnecessaryContinueJS
        continue;
      }
      // (0) changed in Evernote or SimpleMind
    }
    for (const evernoteTodo of evernote) {
      const cachedTodo = this.findInCache(evernoteTodo);
      if (!cachedTodo) {
        // (4) added in Evernote
        this.addToCache(evernoteTodo);
        next.simpleMind.push(evernoteTodo.add());
        continue;
      }
      const simpleMindTodo = simpleMind.find(curr => curr.simpleMindId === cachedTodo.simpleMindId) || null;
      if (!simpleMindTodo) {
        // (1) removed in SimpleMind
        this.removeFromCache(cachedTodo);
        next.evernote.push(evernoteTodo.remove());
        // noinspection UnnecessaryContinueJS
        continue;
      }
      // (0) changed in Evernote or SimpleMind
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
    return (
      this[cache].find(curr => {
        if (curr.simpleMindId !== null && todo.simpleMindId !== null) {
          return curr.simpleMindId === todo.simpleMindId;
        }
        if (curr.evernoteId !== null && todo.evernoteId !== null) {
          return curr.evernoteId === todo.evernoteId;
        }
        return false;
      }) || null
    );
  }

  updateCacheIds(todos) {
    todos.forEach(todo => {
      const cachedTodo = this.findInCache(todo);
      if (cachedTodo === null) {
        return;
      }
      this.addToCache(
        cachedTodo.change({
          evernote: { id: cachedTodo.evernoteId || todo.evernoteId },
          simpleMind: { id: cachedTodo.simpleMindId || todo.simpleMindId }
        })
      );
      this.removeFromCache(cachedTodo);
    });
  }

  saveCache() {
    writeFileSync(CACHE_PATH, JSON.stringify(this[cache]));
    console.log(`Saved ${this[cache].length} locally cached todo items`);
  }

  /* this is only used by the unit tests */
  getTestStatus() {
    return {
      cacheSize: this[cache].length
    };
  }
};
