const fileId = "1wDkYtOXUPn4eer9rfMWmYiSaAoPeEJaJ";
const withDrive = require("./withDrive");
const fs = require("fs");
const path = require("path");
const filePath = path.join(__dirname, "..", "whats-going-on.smmx");

module.exports = auth =>
  withDrive(auth)(
    drive => new Promise(async (resolve, reject) =>{
      console.log(`writing to ${filePath}`);
      const dest = fs.createWriteStream(filePath);
      let progress = 0;
      const res = await drive.files.get(
        { fileId, alt: "media" },
        { responseType: "stream" }
      );
      res.data
        .on("end", () => {
          console.log("\nDone downloading file.");
          resolve(filePath);
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
    }
  ));
