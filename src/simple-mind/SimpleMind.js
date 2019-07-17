const {
  authorize,
  changeTodos,
  cleanUp,
  createTodos,
  deleteTodos,
  downloadMindMap,
  parseMindMapData,
  retrieveMindMapXml,
  retrieveTodos,
  uploadMindMap,
  writeMindMapXml
} = require('./methods');
const { Builder } = require('xml2js');
const { SMMX_PATH } = require('./constants');
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
    await downloadMindMap(this.auth, this[storage]);
    console.log('[SimpleMind.setup] Mind map downloaded successfully');
    const exists = await this[storage].exists(SMMX_PATH);
    console.log(`[SimpleMind.setup] does the file ${SMMX_PATH} exist? ${exists}`);
    const xml = await retrieveMindMapXml(this[storage]);
    console.log('[SimpleMind.setup] XML retrieved from mind map successfully');
    this.data = await parseMindMapData(xml);
    console.log('[SimpleMind.setup] Data parsed from mind map XML successfully');
    console.log(
      `[SimpleMind.setup] Mind map title: ${this.data['simplemind-mindmaps'].mindmap[0].meta[0].title[0].$.text}`
    );
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
    await cleanUp(this[storage]);
  }
};
