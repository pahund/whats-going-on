const { SMMX_PATH, FILE_ID } = require("./constants");
const withDrive = require("./withDrive");
const fs = require("fs");

module.exports = auth =>
  withDrive(auth)(
    drive =>
      new Promise(async (resolve, reject) => {
        console.log(`Writing to ${SMMX_PATH}`);
        const dest = fs.createWriteStream(SMMX_PATH);
        let progress = 0;
        const res = await drive.files.get(
          { fileId: FILE_ID, alt: "media" },
          { responseType: "stream" }
        );
        res.data
          .on("end", () => {
            console.log("\nDone downloading file.");
            resolve();
          })
          .on("error", err => {
            console.error("\nError downloading file.");
            reject(err);
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
      })
  );
