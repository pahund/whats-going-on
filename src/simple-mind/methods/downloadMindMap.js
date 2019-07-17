const { SMMX_PATH } = require('../constants');
const { withDrive, withApiErrorHandling } = require('../utils');
const { createWriteStream } = require('fs');
const { rejectWithCustomMessage } = require('../../utils');

module.exports = (auth, storage) =>
  withDrive(auth)(async drive => {
    const fileId = process.env.GOOGLE_DRIVE_FILE_ID;
    console.log(`Writing to ${SMMX_PATH}`);
    const dest = createWriteStream(SMMX_PATH);
    let progress = 0;
    const res = await withApiErrorHandling(() => drive.files.get({ fileId, alt: 'media' }, { responseType: 'stream' }));
    return new Promise((resolve, reject) =>
      res.data
        .on('end', () => {
          console.log('\nDone downloading file.');
          resolve();
        })
        .on('error', err => {
          console.log('\n');
          return rejectWithCustomMessage(`Error downloading file with ID ${fileId} from Google Drive`, reject, err);
        })
        .on('data', d => {
          progress += d.length;
          if (process.stdout.isTTY) {
            process.stdout.clearLine();
            process.stdout.cursorTo(0);
            process.stdout.write(`Downloaded ${progress} bytes…`);
          }
        })
        .pipe(dest)
    );
  });
