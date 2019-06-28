const withDrive = require('./withDrive');

module.exports = auth =>
  withDrive(auth)(async drive => {
    const q = "mimeType='application/x-zip' and name contains '.smmx'";
    const {
      data: { files }
    } = await drive.files.list({ q });
    return files;
  });
