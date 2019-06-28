const xml2js = require('xml2js');
const parser = new xml2js.Parser();
const { rejectWithCustomMessage } = require('../utils');

module.exports = xml =>
  new Promise((resolve, reject) =>
    parser.parseString(xml, (err, data) => {
      if (err) {
        return rejectWithCustomMessage('Error parsing mind map XML data', reject, err);
      }
      resolve(data);
    })
  );
