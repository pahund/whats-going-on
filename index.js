const smd = require("./src/simple-mind");
const evn = require("./src/evernote");
const { isDevMode } = require("./src/utils");

(async () => {
  let data;
  try {
    const client = await evn.authorize();
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
  console.log(`Todo data:\n${JSON.stringify(data, null, 4)}`);
  process.exit(0);
})();
