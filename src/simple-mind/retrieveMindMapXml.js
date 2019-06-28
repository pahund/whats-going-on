const fs = require('fs');
const JSZip = require('jszip');
const { SMMX_PATH } = require('./constants');
const { rejectWithCustomMessage } = require('../utils');

module.exports = () =>
  new Promise((resolve, reject) =>
    fs.readFile(SMMX_PATH, async (err, data) => {
      if (err) {
        return rejectWithCustomMessage(`Error reading zip file ${SMMX_PATH}`, reject, err);
      }
      try {
        const zip = await JSZip.loadAsync(data);
        const xml = await zip.file('document/mindmap.xml').async('string');
        resolve(xml);
      } catch (err) {
        return rejectWithCustomMessage(`Error retrieving mind map data from ${SMMX_PATH}`, reject, err);
      }
    })
  );
