const { readFileSync } = require('fs');
const { google } = require('googleapis');
const { TOKEN_PATH, CREDENTIALS_PATH } = require('./constants');
const getAccessToken = require('./getAccessToken');
const { rejectWithCustomMessage } = require('../utils');

module.exports = () =>
  new Promise((resolve, reject) => {
    let rawCredentials;
    try {
      rawCredentials = readFileSync(CREDENTIALS_PATH);
    } catch (err) {
      return rejectWithCustomMessage(`Error loading client secret file ${CREDENTIALS_PATH}`, reject, err);
    }
    let credentials;
    try {
      credentials = JSON.parse(rawCredentials);
    } catch (err) {
      return rejectWithCustomMessage(
        `Error parsing credentials from client secret file ${CREDENTIALS_PATH}`,
        reject,
        err
      );
    }
    const { client_secret, client_id, redirect_uris } = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
    let rawToken;
    try {
      rawToken = readFileSync(TOKEN_PATH);
    } catch (err) {
      // no rejection because it's OK if there is no token on the local
      // file system – we'll have the user generate one in this case
      getAccessToken(oAuth2Client)
        .then(() => resolve(oAuth2Client))
        .catch(err => reject(err));
      return;
    }
    let token;
    try {
      token = JSON.parse(rawToken);
    } catch (err) {
      return rejectWithCustomMessage(`Error parsing token from token file ${TOKEN_PATH}`, reject, err);
    }
    oAuth2Client.setCredentials(token);
    resolve(oAuth2Client);
  });
