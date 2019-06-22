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
  constructor({ title, done, evernote = { id: null }, simpleMind = { id: null }, deadline, url } = {}) {
    this[data] = { evernote: {}, simpleMind: {} };
    this.evernoteId = evernote.id;
    this.simpleMindId = simpleMind.id;
    this.title = title;
    this.done = done;
    this.deadline = deadline;
    this.url = url;
  }
  set title(title) {
    if (!title) {
      throw new Error("Title needs to be set");
    }
    if (typeof title !== "string") {
      throw new Error("Title needs to be a string");
    }
    this[data].title = title;
  }
  get title() {
    return this[data].title;
  }
  set done(done) {
    this[data].done = done === true || done === 'true';
  }
  get done() {
    return this[data].done;
  }
  set evernoteId(id) {
    if (!id) {
      this[data].evernote.id = null;
      return;
    }
    if (typeof id !== "string") {
      throw new Error("ID needs to be a string");
    }
    this[data].evernote.id = id;
  }
  get evernoteId() {
    return this[data].evernote.id;
  }
  set simpleMindId(id) {
    if (!id) {
      this[data].simpleMind.id = null;
      return;
    }
    if (typeof id !== "string") {
      throw new Error("ID needs to be a string");
    }
    this[data].simpleMind.id = id;
  }
  get simpleMindId() {
    return this[data].simpleMind.id;
  }
  set deadline(deadline) {
    if (!deadline) {
      this[data].deadline = null;
      return;
    }
    if (!(deadline instanceof Date)) {
      throw new Error("Deadline needs to be a date object");
    }
    this[data].deadline = deadline;
  }
  get deadline() {
    return this[data].deadline;
  }
  set url(url) {
    if (!url) {
      this[data].url = null;
      return;
    }
    if (!validUrlPattern.test(url)) {
      throw new Error("URL is not valid format");
    }
    this[data].url = url;
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
}

module.exports = Todo;

