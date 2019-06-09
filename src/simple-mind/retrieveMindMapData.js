const fs = require("fs");
const JSZip = require("jszip");
const{SMMX_PATH}=require('./constants');

module.exports = () =>
  new Promise((resolve, reject) =>
    fs.readFile(SMMX_PATH, async (err, data) => {
      if (err) {
        err.message = `Error reading zip file ${SMMX_PATH} – ${err.message}`;
        reject(err);
        return;
      }
      try {
        const zip = await JSZip.loadAsync(data);
        const content = await zip.file("document/mindmap.xml").async("string");
        resolve(content);
      } catch (err) {
        err.message = `Error retrieving mind map data from ${SMMX_PATH} – ${err.message}`;
        reject(err);
      }
    })
  );
