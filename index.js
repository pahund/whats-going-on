const smd = require("./src/simple-mind");
const evn = require("./src/evernote");
const { isDevMode } = require("./src/utils");

(async () => {
  let data;
  try {
    const client = await evn.authorize();
    // await evn.fetchTodo(client);
    // await evn.createTodo(client);
    const evernote = await evn.retrieveTodos(client);
    const auth = await smd.authorize();
    await smd.downloadMindMap(auth);
    const xml = await smd.retrieveMindMapData();
    const simpleMind = await smd.retrieveTodos(xml);
    await smd.cleanUp();
    data = {
      evernote,
      simpleMind
    }
  } catch (err) {
    console.error(isDevMode() ? err.stack : err.message);
    process.exit(1);
  }
  Object.entries(data).forEach(([key, value]) => {
    console.log();
    console.log('='.repeat(key.length));
    console.log(key.toUpperCase());
    console.log('='.repeat(key.length));
    console.log();
    console.log(value.join('\n\n'));
  });
  process.exit(0);
})();
