const { readFileSync } = require('fs');
const { google } = require('googleapis');
const { TOKEN_PATH, GOOGLE_DRIVE_API_REDIRECT_URI } = require('../constants');
const { getAccessToken } = require('../utils');
const { rejectWithCustomMessage } = require('../../utils');

module.exports = () =>
  new Promise((resolve, reject) => {
    const clientId = process.env.GOOGLE_DRIVE_API_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_DRIVE_API_CLIENT_SECRET;

    const oAuth2Client = new google.auth.OAuth2(clientId, clientSecret, GOOGLE_DRIVE_API_REDIRECT_URI);
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
