const { google } = require('googleapis');

module.exports = auth => {
  const drive = google.drive({ version: 'v3', auth });
  return func => func(drive);
};
