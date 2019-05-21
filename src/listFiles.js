const withDrive = require("./withDrive");

/**
 * Lists the names and IDs of up to 10 files.
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
module.exports = auth =>
  withDrive(auth)(
    drive =>
      new Promise((resolve, reject) => {
        drive.files.list(
          {
            pageSize: 100,
            fields: "nextPageToken, files(id, name)"
          },
          (err, res) => {
            if (err) {
              console.log("The API returned an error: " + err);
              reject(err);
              return;
            }
            const files = res.data.files;
            if (files.length) {
              console.log("Files:");
              files.map(file => {
                console.log(`${file.name} (${file.id})`);
              });
            } else {
              console.log("No files found.");
            }
            resolve(files);
          }
        );
      })
  );
