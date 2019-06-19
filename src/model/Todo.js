const validUrlPattern = new RegExp(
  "^(https?:\\/\\/)?" + // protocol
  "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
  "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
  "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
  "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
    "(\\#[-a-z\\d_]*)?$",
  "i"
); // fragment locator

module.exports = class Todo {
  constructor({ text, done, id, date, url }) {
    this.data = {};
    this.text = text;
    this.done = done;
    this.id = id;
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
    this.data.text = text;
  }
  get text() {
    return this.data.text;
  }
  set done(done) {
    this.data.done = done === true;
  }
  get done() {
    return this.data.done;
  }
  set id(id) {
    if (!id) {
      throw new Error("ID needs to be set");
    }
    if (typeof id !== "string") {
      throw new Error("ID needs to be a string");
    }
    this.data.id = id;
  }
  get id() {
    return this.data.id;
  }
  set date(date) {
    if (!date) {
      this.data.date = null;
      return;
    }
    if (!(date instanceof Date)) {
      throw new Error("Date needs to be a JavaScript date object");
    }
    this.data.date = date;
  }
  get date() {
    return this.data.date;
  }
  set url(url) {
    if (!url) {
      this.data.url = null;
      return;
    }
    if (!validUrlPattern.test(url)) {
      throw new Error("URL is not valid format");
    }
    this.data.url = url;
  }
  get url() {
    return this.data.url;
  }
  toString() {
    const tokens = [];
    tokens.push(`Text: ${this.text}`);
    tokens.push(`Done: ${this.done}`);
    tokens.push(`ID:   ${this.id}`);
    if (this.date) {
      tokens.push(`Date: ${this.date}`);
    }
    if (this.url) {
      tokens.push(`URL:  ${this.url}`);
    }
    return tokens.join("\n");
  }
};
