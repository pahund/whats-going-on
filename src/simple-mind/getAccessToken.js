const readline = require("readline");
const fs = require("fs");
const { TOKEN_PATH, SCOPES } = require("./constants");
const { rejectWithCustomMessage } = require("../utils");

module.exports = oAuth2Client =>
  new Promise((resolve, reject) => {
    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: "offline",
      scope: SCOPES
    });
    console.log("Authorize Google Drive for this app by visiting this url:", authUrl);
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    rl.question("Enter the code from that page here: ", code => {
      rl.close();
      oAuth2Client.getToken(code, (err, token) => {
        if (err) {
          return rejectWithCustomMessage(
            "Error verifying access token",
            reject,
            err
          );
        }
        oAuth2Client.setCredentials(token);
        // Store the token to disk for later program executions
        fs.writeFile(TOKEN_PATH, JSON.stringify(token), err => {
          if (err) {
            return rejectWithCustomMessage(
              `Failed to store token on local file system at ${TOKEN_PATH}`,
              reject,
              err
            );
          }
          console.log("Token stored to", TOKEN_PATH);
          resolve();
        });
      });
    });
  });
