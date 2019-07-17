const { SMMX_PATH } = require('../constants');
const { withDrive } = require('../utils');

module.exports = (auth, storage) =>
  withDrive(auth)(async drive => {
    const fileId = process.env.GOOGLE_DRIVE_FILE_ID;
    const media = {
      mimeType: 'application/x-zip',
      body: storage.createReadStream(SMMX_PATH).on('error', () => {
        throw new Error(`Error reading file with ${SMMX_PATH} while trying to upload to Google Drive`);
      })
    };

    try {
      await drive.files.update({
        fileId,
        media
      });
    } catch (err) {
      throw new Error(`Error uploading file with ID ${fileId} to Google Drive`);
    }
    console.log(`File ${SMMX_PATH} successfully uploaded to Google Drive`);
  });
