const { SMMX_PATH, FILE_ID } = require("./constants");
const withDrive = require("./withDrive");
const fs = require("fs");
const { rejectWithCustomMessage } = require("../utils");

module.exports = auth =>
  withDrive(auth)(
    async drive => {
      console.log(`Writing to ${SMMX_PATH}`);
      const dest = fs.createWriteStream(SMMX_PATH);
      let progress = 0;
      let res;
      try {
        res = await drive.files.get(
          { fileId: FILE_ID, alt: "media" },
          { responseType: "stream" }
        );
      } catch (err) {
        throw new Error(
          `Error downloading file with ID ${FILE_ID} from Google Drive`,
          err
        );
      }
      return new Promise((resolve, reject) => {
        res.data
          .on("end", () => {
            console.log("\nDone downloading file.");
            resolve();
          })
          .on("error", err => {
            console.log("\n");
            return rejectWithCustomMessage(
              `Error downloading file with ID ${FILE_ID} from Google Drive`,
              reject,
              err
            );
          })
          .on("data", d => {
            progress += d.length;
            if (process.stdout.isTTY) {
              process.stdout.clearLine();
              process.stdout.cursorTo(0);
              process.stdout.write(`Downloaded ${progress} bytes…`);
            }
          })
          .pipe(dest);
      });
    }
  );
