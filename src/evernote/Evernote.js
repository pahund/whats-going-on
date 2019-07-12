const { authorize, retrieveTodos, createTodos, deleteTodos, changeTodos, listNotebooks } = require('./methods');

module.exports = class {
  constructor() {
    this.client = null;
    this.report = null;
  }

  async setup(gmtOffset = 0) {
    this.client = await authorize();
    this.report = {
      added: 0,
      changed: 0,
      removed: 0
    };
    this.gmtOffset = gmtOffset;
  }

  async retrieveTodos() {
    return await retrieveTodos(this.client);
  }

  async createTodos(todos) {
    this.report.added += todos.length;
    return await createTodos(this.client, todos);
  }

  async deleteTodos(todos) {
    this.report.removed += todos.length;
    await deleteTodos(this.client, todos);
  }

  async changeTodos(todos) {
    this.report.changed += todos.length;
    await changeTodos(this.client, todos);
  }

  async listNotebooks() {
    return await listNotebooks(this.client);
  }
};
