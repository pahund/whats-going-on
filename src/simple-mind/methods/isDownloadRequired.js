const { SMMX_PATH } = require('../constants');
const { withDrive, withApiErrorHandling } = require('../utils');

module.exports = (auth, storage) =>
  withDrive(auth)(async drive => {
    if (!(await storage.exists(SMMX_PATH))) {
      console.log(`No local copy of ${SMMX_PATH}, download from Drive is required`);
      return true;
    }
    const fileName = process.env.GOOGLE_DRIVE_FILE_NAME;
    const lastModifiedLocally = await storage.getLastModificationDate(SMMX_PATH);
    const {
      data: {
        files: {
          0: { modifiedTime: lastModifiedOnDrive }
        }
      }
    } = await withApiErrorHandling(() =>
      drive.files.list(
        {
          q: `name='${fileName}'`,
          fields: 'files/modifiedTime'
        },
        { responseType: 'json' }
      )
    );
    const downloadRequired = new Date(lastModifiedLocally) < new Date(lastModifiedOnDrive);
    console.log(
      downloadRequired
        ? 'MindMap was changed in SimpleMind, download from Drive is required'
        : 'MindMap was not changed in SimpleMind, using cached local copy'
    );
    return downloadRequired;
  });
