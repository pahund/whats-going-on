const fs = require("fs");
const JSZip = require("jszip");
const{SMMX_PATH}=require('./constants');

module.exports = () =>
  new Promise((resolve, reject) =>
    fs.readFile(SMMX_PATH, async (err, data) => {
      if (err) {
        console.error("Error reading zip file", err);
        reject(err);
        return;
      }
      const zip = await JSZip.loadAsync(data);
      const content = await zip.file("document/mindmap.xml").async("string");
      resolve(content);
    })
  );
