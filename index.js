const fs = require("fs");
const authorize = require('./src/authorize');
const downloadMindMap = require('./src/downloadMindMap');
const retrieveMindMapData = require('./src/retrieveMindMapData');
const retrieveTodoItems = require('./src/retrieveTodoItems');

// Load client secrets from a local file.
fs.readFile("credentials.json", (err, content) => {
  if (err) {
    return console.log("Error loading client secret file:", err);
  }
  // Authorize a client with credentials, then call the Google Drive API.
  authorize(JSON.parse(content), async auth => {
    await downloadMindMap(auth);
    const xml = await retrieveMindMapData();
    const data = await retrieveTodoItems(xml);
    console.log(`[PH_LOG] data\n${JSON.stringify(data, null, 4)}`); // PH_TODO
  });
});


