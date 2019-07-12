const { UNCHANGED, CHANGED, REMOVED, ADDED } = require('./constants');

const validUrlPattern = new RegExp(
  '^(https?:\\/\\/)?' + // protocol
  '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
  '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
  '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
  '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
    '(\\#[-a-z\\d_=]*)?$',
  'i'
); // fragment locator

const data = Symbol('data');
const changedData = Symbol('changed data');
const syncStatus = Symbol('sync status');

class Todo {
  constructor({
    title,
    done,
    evernote = { id: null, order: null, deadlineTime: null },
    simpleMind = { id: null },
    deadline,
    url,
    changed = {
      title: false,
      done: false,
      evernote: {
        id: false
      },
      simpleMind: {
        id: false
      },
      deadline: false,
      url: false
    },
    status = UNCHANGED
  } = {}) {
    this[data] = { evernote: {}, simpleMind: {} };
    this[syncStatus] = status;
    this[changedData] = changed;
    if (!evernote.id) {
      this[data].evernote.id = null;
    } else if (typeof evernote.id !== 'string') {
      throw new Error('ID needs to be a string');
    } else {
      this[data].evernote.id = evernote.id;
    }
    if (!evernote.order) {
      this[data].evernote.order = null;
    } else if (typeof evernote.order !== 'number') {
      throw new Error('Evernote order needs to be a number');
    } else {
      this[data].evernote.order = evernote.order;
    }
    if (!evernote.deadlineTime) {
      this[data].evernote.deadlineTime = null;
    } else if (
      typeof evernote.deadlineTime !== 'string' &&
      !evernote.deadlineTime.match(/^[0-9]{2}:[0-9]{2}:[0-9]{2}\.[0-9]{3}Z$/)
    ) {
      throw new Error('Evernote deadline time needs to be a string in format hh:mm:ss.mmmZ');
    } else {
      this[data].evernote.deadlineTime = evernote.deadlineTime;
    }
    if (!simpleMind.id) {
      this[data].simpleMind.id = null;
    } else if (typeof simpleMind.id !== 'string') {
      throw new Error('ID needs to be a string');
    } else {
      this[data].simpleMind.id = simpleMind.id;
    }
    if (!title) {
      throw new Error('Title needs to be set');
    }
    if (typeof title !== 'string') {
      throw new Error('Title needs to be a string');
    }
    this[data].title = title;
    this[data].done = done === true || done === 'true';
    if (!deadline) {
      this[data].deadline = null;
    } else if (typeof deadline === 'string') {
      const date = new Date(deadline);
      if (isNaN(date)) {
        throw new Error('Deadline needs to be a date object or ISO 8601 string');
      }
      this[data].deadline = date;
    } else if (!(deadline instanceof Date)) {
      throw new Error('Deadline needs to be a date object or ISO 8601 string');
    } else {
      this[data].deadline = deadline;
    }
    if (!url) {
      this[data].url = null;
    } else if (!validUrlPattern.test(url)) {
      throw new Error(`URL ${url} is not valid format`);
    } else {
      this[data].url = url;
    }
  }

  // noinspection JSMethodCanBeStatic,JSUnusedLocalSymbols
  set status(status) {
    throw new Error('Cannot set status, todos are immutable – use change instead');
  }
  get status() {
    return this[syncStatus];
  }
  // noinspection JSMethodCanBeStatic,JSUnusedLocalSymbols
  set title(title) {
    throw new Error('Cannot set title, todos are immutable – use change instead');
  }
  get title() {
    return this[data].title;
  }
  // noinspection JSMethodCanBeStatic,JSUnusedLocalSymbols
  set titleChanged(titleChanged) {
    throw new Error('Cannot set titleChanged, todos are immutable – use change instead');
  }
  get titleChanged() {
    return this[changedData].title;
  }
  // noinspection JSMethodCanBeStatic,JSUnusedLocalSymbols
  set done(done) {
    throw new Error('Cannot set done, todos are immutable – use change instead');
  }
  get done() {
    return this[data].done;
  }
  // noinspection JSMethodCanBeStatic,JSUnusedLocalSymbols
  set doneChanged(done) {
    throw new Error('Cannot set doneChanged, todos are immutable – use change instead');
  }
  get doneChanged() {
    return this[changedData].done;
  }
  // noinspection JSMethodCanBeStatic,JSUnusedLocalSymbols
  set evernoteId(id) {
    throw new Error('Cannot set evernoteId, todos are immutable – use change instead');
  }
  get evernoteId() {
    return this[data].evernote.id;
  }
  // noinspection JSMethodCanBeStatic,JSUnusedLocalSymbols
  set evernoteIdChanged(id) {
    throw new Error('Cannot set evernoteIdChanged, todos are immutable – use change instead');
  }
  get evernoteIdChanged() {
    return this[changedData].evernote.id;
  }
  // noinspection JSMethodCanBeStatic,JSUnusedLocalSymbols
  set evernoteOrder(order) {
    throw new Error('Cannot set evernoteOrder, todos are immutable – use change instead');
  }
  get evernoteOrder() {
    return this[data].evernote.order;
  }
  // noinspection JSMethodCanBeStatic,JSUnusedLocalSymbols
  set evernoteDeadlineTime(deadlineTome) {
    throw new Error('Cannot set evernoteDeadlineTime, todos are immutable – use change instead');
  }
  get evernoteDeadlineTime() {
    return this[data].evernote.deadlineTime;
  }
  // noinspection JSMethodCanBeStatic,JSUnusedLocalSymbols
  set simpleMindId(id) {
    throw new Error('Cannot set simpleMindId, todos are immutable – use change instead');
  }
  get simpleMindId() {
    return this[data].simpleMind.id;
  }
  // noinspection JSMethodCanBeStatic,JSUnusedLocalSymbols
  set simpleMindIdChanged(id) {
    throw new Error('Cannot set simpleMindIdChanged, todos are immutable – use change instead');
  }
  get simpleMindIdChanged() {
    return this[changedData].simpleMind.id;
  }
  // noinspection JSMethodCanBeStatic,JSUnusedLocalSymbols
  set deadline(deadline) {
    throw new Error('Cannot set deadline, todos are immutable – use change instead');
  }
  get deadline() {
    return this[data].deadline;
  }
  // noinspection JSMethodCanBeStatic,JSUnusedLocalSymbols
  set deadlineChanged(deadline) {
    throw new Error('Cannot set deadlineChanged, todos are immutable – use change instead');
  }
  get deadlineChanged() {
    return this[changedData].deadline;
  }
  // noinspection JSMethodCanBeStatic,JSUnusedLocalSymbols
  set url(url) {
    throw new Error('Cannot set url, todos are immutable – use change instead');
  }
  get url() {
    return this[data].url;
  }
  // noinspection JSMethodCanBeStatic,JSUnusedLocalSymbols
  set urlChanged(url) {
    throw new Error('Cannot set urlChanged, todos are immutable – use change instead');
  }
  get urlChanged() {
    return this[changedData].url;
  }
  toString() {
    const tokens = [];
    tokens.push(`${this.titleChanged ? '*' : ' '}Title:                  ${this.title}`);
    tokens.push(`${this.doneChanged ? '*' : ' '}Done:                   ${this.done}`);
    if (this.evernoteId) {
      tokens.push(`${this.evernoteIdChanged ? '*' : ' '}Evernote ID:            ${this.evernoteId}`);
    }
    if (this.evernoteOrder) {
      tokens.push(` Evernote order:         ${this.evernoteOrder}`);
    }
    if (this.evernoteDeadlineTime) {
      tokens.push(` Evernote deadline time: ${this.evernoteDeadlineTime}`);
    }
    if (this.simpleMindId) {
      tokens.push(`${this.simpleMindIdChanged ? '*' : ' '}SimpleMind ID:          ${this.simpleMindId}`);
    }
    if (this.deadline) {
      tokens.push(`${this.deadlineChanged ? '*' : ' '}Deadline:               ${this.deadline.toISOString()}`);
    }
    if (this.url) {
      tokens.push(`${this.urlChanged ? '*' : ' '}URL:                    ${this.url}`);
    }
    return tokens.join('\n');
  }
  clone() {
    return new Todo({
      title: this.title,
      deadline: this.deadline,
      done: this.done,
      url: this.url,
      evernote: { id: this.evernoteId, order: this.evernoteOrder, deadlineTime: this.evernoteDeadlineTime },
      simpleMind: { id: this.simpleMindId }
    });
  }

  add() {
    return new Todo({
      title: this.title,
      deadline: this.deadline,
      done: this.done,
      url: this.url,
      evernote: { id: this.evernoteId, order: this.evernoteOrder, deadlineTime: this.evernoteDeadlineTime },
      simpleMind: { id: this.simpleMindId },
      status: ADDED
    });
  }

  remove() {
    return new Todo({
      title: this.title,
      deadline: this.deadline,
      done: this.done,
      url: this.url,
      evernote: { id: this.evernoteId, order: this.evernoteOrder, deadlineTime: this.evernoteDeadlineTime },
      simpleMind: { id: this.simpleMindId },
      status: REMOVED
    });
  }

  hasSameDeadlineAs(other) {
    const a = this.deadline ? this.deadline.getTime() : null;
    const b = other.deadline ? other.deadline.getTime() : null;
    return a === b;
  }

  hasDifferentDeadlineThan(other) {
    return !this.hasSameDeadlineAs(other);
  }

  // eslint-disable-next-line complexity
  change(
    { title, done, evernote = {}, simpleMind = {}, deadline, url } = {
      evernote: {},
      simpleMind: {}
    }
  ) {
    return new Todo({
      title: title === undefined ? this.title : title,
      done: done === undefined ? this.done : done,
      evernote: {
        id: evernote.id === undefined ? this.evernoteId : evernote.id,
        order: evernote.order === undefined ? this.evernoteOrder : evernote.order,
        deadlineTime: evernote.deadlineTime === undefined ? this.evernoteDeadlineTime : evernote.deadlineTime
      },
      simpleMind: {
        id: simpleMind.id === undefined ? this.simpleMindId : simpleMind.id
      },
      deadline: deadline === undefined ? this.deadline : deadline,
      url: url === undefined ? this.url : url,
      changed: {
        title: title === undefined ? this[changedData].title : true,
        done: done === undefined ? this[changedData].done : true,
        evernote: {
          id: evernote.id === undefined ? this[changedData].evernote.id : true
        },
        simpleMind: {
          id: simpleMind.id === undefined ? this[changedData].simpleMind.id : true
        },
        deadline: deadline === undefined ? this[changedData].deadline : true,
        url: url === undefined ? this[changedData].url : true
      },
      status:
        title !== undefined ||
        done !== undefined ||
        evernote.id !== undefined ||
        evernote.order !== undefined ||
        evernote.deadlineTime !== undefined ||
        simpleMind.id !== undefined ||
        deadline !== undefined ||
        url !== undefined
          ? CHANGED
          : UNCHANGED
    });
  }
  toJSON() {
    return {
      ...this[data],
      status: this[syncStatus]
    };
  }
}

module.exports = Todo;
