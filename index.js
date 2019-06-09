const {
  authorizeWithGoogleDrive,
  downloadMindMap,
  retrieveTodoItems,
  retrieveMindMapData,
  cleanUp
} = require("./src/simple-mind");
const {authorizeWithEvernote}=require('./src/evernote');
const { isDevMode } = require("./src/utils");

(async () => {
  let data;
  try {
    const client = await authorizeWithEvernote();
    // const auth = await authorizeWithGoogleDrive();
    // await downloadMindMap(auth);
    // const xml = await retrieveMindMapData();
    // data = await retrieveTodoItems(xml);
    // await cleanUp();
  } catch (err) {
    console.error(isDevMode() ? err.stack : err.message);
    process.exit(1);
  }
  console.log(`Todo data from mind map:\n${JSON.stringify(data, null, 4)}`);
  process.exit(0);
})();
