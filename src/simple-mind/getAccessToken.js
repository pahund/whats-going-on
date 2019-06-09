const readline = require("readline");
const fs = require("fs");
const { TOKEN_PATH, SCOPES } = require("./constants");

module.exports = oAuth2Client =>
  new Promise((resolve, reject) => {
    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: "offline",
      scope: SCOPES
    });
    console.log("Authorize this app by visiting this url:", authUrl);
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    rl.question("Enter the code from that page here: ", code => {
      rl.close();
      oAuth2Client.getToken(code, (err, token) => {
        if (err) {
          err.message = `Error verifying access token – ${err.message}`;
          reject(err);
          return;
        }
        oAuth2Client.setCredentials(token);
        // Store the token to disk for later program executions
        fs.writeFile(TOKEN_PATH, JSON.stringify(token), err => {
          if (err) {
            err.message = `Failed to store token on local file system – ${
              err.message
            }`;
            reject(err);
            return;
          }
          console.log("Token stored to", TOKEN_PATH);
          resolve();
        });
      });
    });
  });
