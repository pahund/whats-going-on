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
  constructor({ text, done, evernote = {}, simpleMind = {}, date, url }) {
    if (!evernote.id && !simpleMind.id) {
      throw new Error(
        "Either Evernote of SimpleMind ID needs to be set (or both)"
      );
    }
    this[data] = { evernote, simpleMind };
    this.text = text;
    this.done = done;
    this.date = date;
    this.url = url;
  }
  set text(text) {
    if (!text) {
      throw new Error("Text needs to be set");
    }
    if (typeof text !== "string") {
      throw new Error("Text needs to be a string");
    }
    this[data].text = text;
  }
  get text() {
    return this[data].text;
  }
  set done(done) {
    this[data].done = done === true;
  }
  get done() {
    return this[data].done;
  }
  set evernoteId(id) {
    if (!id) {
      if (!this.simpleMindId) {
        throw new Error("ID needs to be set");
      }
      this[data].evernote.id = null;
    }
    if (typeof id !== "string") {
      throw new Error("ID needs to be a string");
    }
    this[data].id = id;
  }
  get evernoteId() {
    return this[data].evernote.id;
  }
  set simpleMindId(id) {
    if (!id) {
      if (!this.evernoteId) {
        throw new Error("ID needs to be set");
      }
      this[data].simpleMind.id = null;
    }
    if (typeof id !== "string") {
      throw new Error("ID needs to be a string");
    }
    this[data].id = id;
  }
  get simpleMindId() {
    return this[data].simpleMind.id;
  }
  set date(date) {
    if (!date) {
      this[data].date = null;
      return;
    }
    if (!(date instanceof Date)) {
      throw new Error("Date needs to be a JavaScript date object");
    }
    this[data].date = date;
  }
  get date() {
    return this[data].date;
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
    tokens.push(`Text:          ${this.text}`);
    tokens.push(`Done:          ${this.done}`);
    if (this.evernoteId) {
      tokens.push(`ID Evernote:   ${this.evernoteId}`);
    }
    if (this.simpleMindId) {
      tokens.push(`ID SimpleMind: ${this.simpleMindId}`);
    }
    if (this.date) {
      tokens.push(`Date:          ${this.date}`);
    }
    if (this.url) {
      tokens.push(`URL:           ${this.url}`);
    }
    return tokens.join("\n");
  }
}

module.exports = Todo;

