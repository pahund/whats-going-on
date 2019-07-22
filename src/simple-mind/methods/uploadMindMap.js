const { SMMX_PATH } = require('../constants');
const { withDrive } = require('../utils');

module.exports = (auth, storage) =>
  withDrive(auth)(async drive => {
    let progress = 0;
    const fileId = process.env.GOOGLE_DRIVE_FILE_ID;
    const media = {
      mimeType: 'application/x-zip',
      body: storage
        .createReadStream(SMMX_PATH)
        .on('error', () => {
          throw new Error(`Error reading file with ${SMMX_PATH} while trying to upload to Google Drive`);
        })
        .on('data', d => {
          progress += d.length;
        })
        .on('end', () => console.log(`${progress} bytes read from storage`))
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
