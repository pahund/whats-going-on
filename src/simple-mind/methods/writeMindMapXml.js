const JSZip = require('jszip');
const { SMMX_PATH } = require('../constants');

module.exports = async (xml, storage) => {
  const data = await storage.read(SMMX_PATH);
  const zip = await JSZip.loadAsync(data);
  await zip.file('document/mindmap.xml', xml);
  await new Promise(resolve => {
    zip
      .generateNodeStream({ type: 'nodebuffer', streamFiles: true })
      .pipe(storage.createWriteStream(SMMX_PATH))
      .on('finish', () => {
        console.log(`File ${SMMX_PATH} updated`);
        resolve();
      });
  });
};
