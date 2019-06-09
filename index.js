const {
  authorizeWithGoogleDrive,
  downloadMindMap,
  retrieveTodoItems,
  retrieveMindMapData,
  cleanUp
} = require("./src/simple-mind");

(async () => {
  let data;
  try {
    const auth = await authorizeWithGoogleDrive();
    await downloadMindMap(auth);
    const xml = await retrieveMindMapData();
    data = await retrieveTodoItems(xml);
    await cleanUp();
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
  console.log(`Todo data from mind map:\n${JSON.stringify(data, null, 4)}`);
  process.exit(0);
})();
