const JSZip = require('jszip');
const { SMMX_PATH } = require('../constants');

module.exports = async storage => {
  const data = await storage.read(SMMX_PATH);
  console.log('[retrieveMindMapXml] mind map data was read');
  const zip = await JSZip.loadAsync(data);
  console.log('[retrieveMindMapXml] zip file was loaded');
  const xml = await zip.file('document/mindmap.xml').async('string');
  console.log('[retrieveMindMapXml] XML was retrieved from zip file');
  return xml;
};
