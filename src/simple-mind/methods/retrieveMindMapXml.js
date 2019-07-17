const JSZip = require('jszip');
const { SMMX_PATH } = require('../constants');

module.exports = async storage => {
  const data = await storage.read(SMMX_PATH);
  const zip = await JSZip.loadAsync(data);
  return await zip.file('document/mindmap.xml').async('string');
};
