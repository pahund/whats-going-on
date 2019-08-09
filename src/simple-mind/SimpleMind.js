const {
  authorize,
  changeTodos,
  createTodos,
  deleteTodos,
  downloadMindMap,
  isDownloadRequired,
  parseMindMapData,
  retrieveMindMapXml,
  retrieveTodos,
  uploadMindMap,
  writeMindMapXml
} = require('./methods');
const { Builder } = require('xml2js');
const storage = Symbol('Storage client');

module.exports = class {
  constructor({ storage: storageClient }) {
    this.auth = null;
    this.data = null;
    this.report = null;
    this.gmtOffset = null;
    this[storage] = storageClient;
  }

  async setup(gmtOffset = 0) {
    this.auth = await authorize();
    if (await isDownloadRequired(this.auth, this[storage])) {
      await downloadMindMap(this.auth, this[storage]);
    }
    const xml = await retrieveMindMapXml(this[storage]);
    this.data = await parseMindMapData(xml);
    this.report = {
      added: 0,
      changed: 0,
      removed: 0
    };
    this.gmtOffset = gmtOffset;
  }

  retrieveTodos() {
    return retrieveTodos(this.data);
  }

  createTodos(todos) {
    this.report.added += todos.length;
    const [nextData, nextTodos] = createTodos(this.data, todos);
    this.data = nextData;
    return nextTodos;
  }

  deleteTodos(todos) {
    this.report.removed += todos.length;
    this.data = deleteTodos(this.data, todos);
  }

  changeTodos(todos) {
    this.report.changed += todos.length;
    this.data = changeTodos(this.data, todos);
  }

  async teardown() {
    if (this.report.added + this.report.changed + this.report.removed > 0) {
      // only update the smmx file on Google Drive if necessary
      const builder = new Builder();
      const xml = builder.buildObject(this.data);
      await writeMindMapXml(xml, this[storage]);
      await uploadMindMap(this.auth, this[storage]);
    }
  }
};
