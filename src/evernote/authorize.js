const { readFileSync } = require('fs');
const { CREDENTIALS_PATH, TOKEN_PATH } = require('./constants');
const { rejectWithCustomMessage } = require('../utils');
const { Client } = require('evernote');
const { getAccessToken } = require('./utils');

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
    let rawToken;
    try {
      rawToken = readFileSync(TOKEN_PATH);
    } catch (err) {
      // no rejection because it's OK if there is no token on the local
      // file system – we'll have the user generate one in this case
      const client = new Client(credentials);
      getAccessToken(client)
        .then(authorizedClient => {
          resolve(authorizedClient);
        })
        .catch(err => reject(err));
      return;
    }
    let token;
    try {
      ({ token } = JSON.parse(rawToken));
    } catch (err) {
      return rejectWithCustomMessage(`Error parsing token from token file ${TOKEN_PATH}`, reject, err);
    }
    resolve(
      new Client({
        token,
        sandbox: credentials.sandbox,
        china: credentials.china
      })
    );
  });
