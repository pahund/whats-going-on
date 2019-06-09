const readline = require("readline");
const { Client } = require("evernote");
const { rejectWithCustomMessage } = require("../utils");

module.exports = client => {
  return new Promise((resolve, reject) => {
    client.getRequestToken(
      "https://pahund.github.io/whats-going-on",
      (err, oauthToken, oauthTokenSecret) => {
        if (err) {
          return rejectWithCustomMessage(
            "Failed to obtain OAuth request token for Evernote",
            reject,
            err
          );
        }

        const authUrl = client.getAuthorizeUrl(oauthToken);
        console.log(
          "Authorize Evernote for this app by visiting this url:",
          authUrl
        );
        const rl = readline.createInterface({
          input: process.stdin,
          output: process.stdout
        });
        rl.question("Enter the code from that page here: ", oauthVerifier => {
          rl.close();
          client.getAccessToken(
            oauthToken,
            oauthTokenSecret,
            oauthVerifier,
            (err, oauthToken) => {
              if (err) {
                return rejectWithCustomMessage(
                  "Failed to obtain OAuth access token for Evernote",
                  reject,
                  err
                );
              }
              resolve(
                new Client({
                  token: oauthToken,
                  sandbox: client.sandbox,
                  china: client.china
                })
              );
            }
          );
        });
      }
    );
  });
};
