const validUrlPattern = new RegExp(
  "^(https?:\\/\\/)?" + // protocol
  "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
  "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
  "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
  "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
    "(\\#[-a-z\\d_]*)?$",
  "i"
); // fragment locator

const data = Symbol("data");

class Todo {
  constructor({
    title,
    done,
    evernote = { id: null },
    simpleMind = { id: null },
    deadline,
    url
  } = {}) {
    this[data] = { evernote: {}, simpleMind: {} };
    if (!evernote.id) {
      this[data].evernote.id = null;
    } else if (typeof evernote.id !== "string") {
      throw new Error("ID needs to be a string");
    } else {
      this[data].evernote.id = evernote.id;
    }
    if (!simpleMind.id) {
      this[data].simpleMind.id = null;
    } else if (typeof simpleMind.id !== "string") {
      throw new Error("ID needs to be a string");
    } else {
      this[data].simpleMind.id = simpleMind.id;
    }
    if (!title) {
      throw new Error("Title needs to be set");
    }
    if (typeof title !== "string") {
      throw new Error("Title needs to be a string");
    }
    this[data].title = title;
    this[data].done = done === true || done === "true";
    if (!deadline) {
      this[data].deadline = null;
    } else if (!(deadline instanceof Date)) {
      throw new Error("Deadline needs to be a date object");
    } else {
      this[data].deadline = deadline;
    }
    if (!url) {
      this[data].url = null;
    } else if (!validUrlPattern.test(url)) {
      throw new Error("URL is not valid format");
    } else {
      this[data].url = url;
    }
  }

  // noinspection JSMethodCanBeStatic,JSUnusedLocalSymbols
  set title(title) {
    throw new Error(
      "Cannot set title, todos are immutable – use change instead"
    );
  }
  get title() {
    return this[data].title;
  }
  // noinspection JSMethodCanBeStatic,JSUnusedLocalSymbols
  set done(done) {
    throw new Error(
      "Cannot set done, todos are immutable – use change instead"
    );
  }
  get done() {
    return this[data].done;
  }
  // noinspection JSMethodCanBeStatic,JSUnusedLocalSymbols
  set evernoteId(id) {
    throw new Error(
      "Cannot set evernoteId, todos are immutable – use change instead"
    );
  }
  get evernoteId() {
    return this[data].evernote.id;
  }
  // noinspection JSMethodCanBeStatic,JSUnusedLocalSymbols
  set simpleMindId(id) {
    throw new Error(
      "Cannot set simpleMindId, todos are immutable – use change instead"
    );
  }
  get simpleMindId() {
    return this[data].simpleMind.id;
  }
  // noinspection JSMethodCanBeStatic,JSUnusedLocalSymbols
  set deadline(deadline) {
    throw new Error(
      "Cannot set deadline, todos are immutable – use change instead"
    );
  }
  get deadline() {
    return this[data].deadline;
  }
  // noinspection JSMethodCanBeStatic,JSUnusedLocalSymbols
  set url(url) {
    throw new Error("Cannot set url, todos are immutable – use change instead");
  }
  get url() {
    return this[data].url;
  }
  toString() {
    const tokens = [];
    tokens.push(`Title:         ${this.title}`);
    tokens.push(`Done:          ${this.done}`);
    if (this.evernoteId) {
      tokens.push(`ID Evernote:   ${this.evernoteId}`);
    }
    if (this.simpleMindId) {
      tokens.push(`ID SimpleMind: ${this.simpleMindId}`);
    }
    if (this.deadline) {
      tokens.push(`Deadline:      ${this.deadline}`);
    }
    if (this.url) {
      tokens.push(`URL:           ${this.url}`);
    }
    return tokens.join("\n");
  }
  clone() {
    return new Todo({
      title: this.title,
      deadline: this.deadline,
      done: this.done,
      url: this.url,
      evernote: { id: this.evernoteId },
      simpleMind: { id: this.simpleMindId }
    });
  }
  change(
    {
      title = null,
      done = null,
      evernote = { id: null },
      simpleMind = { id: null },
      deadline = null,
      url = null
    } = {
      title: null,
      done: null,
      evernote: { id: null },
      simpleMind: { id: null },
      deadline: null,
      url: null
    }
  ) {
    return new Todo({
      title: title === null ? this.title : title,
      done: done === null ? this.done : done,
      evernote: {
        id: evernote.id === null ? this.evernoteId : evernote.id
      },
      simpleMind: {
        id: simpleMind.id === null ? this.simpleMindId : simpleMind.id
      },
      deadline: deadline === null ? this.deadline : deadline,
      url: url === null ? this.url : url
    });
  }
}

module.exports = Todo;
