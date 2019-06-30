const { SMMX_PATH, FILE_ID } = require('./constants');
const { withDrive } = require('./utils');
const { createReadStream } = require('fs');

module.exports = auth =>
  withDrive(auth)(async drive => {
    const media = {
      mimeType: 'application/x-zip',
      body: createReadStream(SMMX_PATH).on('error', () => {
        throw new Error(`Error reading file with ${SMMX_PATH} while trying to upload to Google Drive`);
      })
    };

    try {
      await drive.files.update({
        fileId: FILE_ID,
        media
      });
    } catch (err) {
      throw new Error(`Error uploading file with ID ${FILE_ID} to Google Drive`);
    }
    console.log(`File ${SMMX_PATH} successfully uploaded to Google Drive`);
  });
