const fs = require("fs");
const JSZip = require("jszip");
const path = require("path");
const filePath = path.join(__dirname, "..", "whats-going-on.smmx");

module.exports = () =>
  new Promise((resolve, reject) =>
    fs.readFile(filePath, async (err, data) => {
      if (err) {
        console.error("Error reading zip file", err);
        reject(err);
        return;
      }
      const zip = await JSZip.loadAsync(data);
      console.log('[PH_LOG] zip.folder("document"):', zip.folder("document")); // PH_TODO
    })
  );
