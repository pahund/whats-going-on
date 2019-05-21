const fs = require("fs");
const authorize = require('./src/authorize');
const listFiles = require('./src/listFiles');
const downloadMindMap = require('./src/downloadMindMap');
const unzipMindMap = require('./src/unzipMindMap');

// Load client secrets from a local file.
fs.readFile("credentials.json", (err, content) => {
  if (err) {
    return console.log("Error loading client secret file:", err);
  }
  // Authorize a client with credentials, then call the Google Drive API.
  authorize(JSON.parse(content), async auth => {
    await downloadMindMap(auth);
    await unzipMindMap();
  });
});


