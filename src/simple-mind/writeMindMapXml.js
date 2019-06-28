const fs = require('fs');
const JSZip = require('jszip');
const { SMMX_PATH } = require('./constants');

module.exports = async xml => {
  const data = fs.readFileSync(SMMX_PATH);
  const zip = await JSZip.loadAsync(data);
  await zip.file('document/mindmap.xml', xml);
  await new Promise(resolve => {
    zip
      .generateNodeStream({ type: 'nodebuffer', streamFiles: true })
      .pipe(fs.createWriteStream(SMMX_PATH))
      .on('finish', () => {
        console.log(`File ${SMMX_PATH} updated`);
        resolve();
      });
  });
};
