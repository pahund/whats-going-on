const readline = require('readline');
const fs = require('fs');
const { Client } = require('evernote');
const { rejectWithCustomMessage } = require('../../utils');
const { REDIRECT_URL, TOKEN_PATH } = require('../constants');

module.exports = client => {
  return new Promise((resolve, reject) => {
    client.getRequestToken(REDIRECT_URL, (err, oauthToken, oauthTokenSecret) => {
      if (err) {
        return rejectWithCustomMessage('Failed to obtain OAuth request token for Evernote', reject, err);
      }

      const authUrl = client.getAuthorizeUrl(oauthToken);
      console.log('Authorize Evernote for this app by visiting this url:', authUrl);
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });
      rl.question('Enter the code from that page here: ', oauthVerifier => {
        rl.close();
        client.getAccessToken(oauthToken, oauthTokenSecret, oauthVerifier, (err, oauthToken) => {
          if (err) {
            return rejectWithCustomMessage('Failed to obtain OAuth access token for Evernote', reject, err);
          }
          // Store the token to disk for later program executions
          fs.writeFile(TOKEN_PATH, `{"token":"${oauthToken}"}`, err => {
            if (err) {
              return rejectWithCustomMessage(
                `Failed to store Evernote token on local file system at ${TOKEN_PATH}`,
                reject,
                err
              );
            }
            console.log('Evernote token stored to', TOKEN_PATH);
            resolve(
              new Client({
                token: oauthToken,
                sandbox: client.sandbox,
                china: client.china
              })
            );
          });
        });
      });
    });
  });
};
